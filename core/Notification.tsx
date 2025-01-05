import { GLib, Variable, bind } from "astal";
import { Astal, Gtk, Gdk } from "astal/gtk3";
import { type EventBox } from "astal/gtk3/widget";
import Notifd from "gi://AstalNotifd";
import { insertNewlines } from "core/utils/strings";

import { type Subscribable } from "astal/binding";

const TIMEOUT_DELAY = 7_000;

class NotifiationMap implements Subscribable {
  // the underlying map to keep track of id widget pairs
  private map: Map<number, Gtk.Widget> = new Map();

  // it makes sense to use a Variable under the hood and use its
  // reactivity implementation instead of keeping track of subscribers ourselves
  private var: Variable<Array<Gtk.Widget>> = Variable([]);

  // notify subscribers to rerender when state changes
  private notifiy() {
    this.var.set([...this.map.values()].reverse());
  }

  constructor() {
    const notifd = Notifd.get_default();

    /**
     * uncomment this if you want to
     * ignore timeout by senders and enforce our own timeout
     * note that if the notification has any actions
     * they might not work, since the sender already treats them as resolved
     */
    // notifd.ignoreTimeout = true

    notifd.connect("notified", (_, id) => {
      let hideTimeout: GLib.Source | null = null;

      if (notifd.dontDisturb) {
        return;
      }

      this.set(
        id,
        Notification({
          notification: notifd.get_notification(id)!,

          // once hovering over the notification is done
          // destroy the widget without calling notification.dismiss()
          // so that it acts as a "popup" and we can still display it
          // in a notification center like widget
          // but clicking on the close button will close it
          onHoverLost: () => {
            hideTimeout = setTimeout(() => {
              this.delete(id);
              hideTimeout?.destroy();
              hideTimeout = null;
            }, TIMEOUT_DELAY);
          },
          onHover() {
            hideTimeout?.destroy();
            hideTimeout = null;
          },

          // notifd by default does not close notifications
          // until user input or the timeout specified by sender
          // which we set to ignore above
          setup: () => {
            hideTimeout = setTimeout(() => {
              this.delete(id);
              hideTimeout?.destroy();
              hideTimeout = null;
            }, TIMEOUT_DELAY);
          },
          useHistoryCss: false,
        }),
      );
    });

    // notifications can be closed by the outside before
    // any user input, which have to be handled too
    notifd.connect("resolved", (_, id) => {
      this.delete(id);
    });
  }

  private set(key: number, value: Gtk.Widget) {
    // in case of replacecment destroy previous widget
    this.map.get(key)?.destroy();
    this.map.set(key, value);
    this.notifiy();
  }

  private delete(key: number) {
    this.map.get(key)?.destroy();
    this.map.delete(key);
    this.notifiy();
  }

  // needed by the Subscribable interface
  get() {
    return this.var.get();
  }

  // needed by the Subscribable interface
  subscribe(callback: (list: Array<Gtk.Widget>) => void) {
    return this.var.subscribe(callback);
  }
}

const time = (time: number, format = "%I:%M %p") =>
  GLib.DateTime.new_from_unix_local(time).format(format)!;

const urgency = (n: Notifd.Notification) => {
  const { LOW, NORMAL, CRITICAL } = Notifd.Urgency;
  // match operator when?
  switch (n.urgency) {
    case LOW:
      return "low";
    case CRITICAL:
      return "critical";
    case NORMAL:
    default:
      return "normal";
  }
};

type Props = {
  setup(self: EventBox): void;
  onHoverLost(self: EventBox): void;
  onHover(self: EventBox): void;
  notification: Notifd.Notification;
  useHistoryCss: boolean;
};

function NotificationIcon({
  notification,
}: {
  notification: Notifd.Notification;
}) {
  const image = notification.image || notification.get_image();
  if (image) {
    console.log(image);
    return (
      <box
        css={`
          background-image: url("${image}");
          background-size: cover;
          background-repeat: no-repeat;
          background-position: center;
          min-width: 50px;
          min-height: 50px;
        `}
      ></box>
    );
  }
  return <box></box>;
}

export function Notification(props: Props) {
  const { notification: n, onHoverLost, onHover, setup, useHistoryCss } = props;
  const { START, END } = Gtk.Align;

  return (
    <eventbox
      className={
        useHistoryCss ? `Notification history` : `Notification ${urgency(n)}`
      }
      setup={setup}
      onHoverLost={onHoverLost}
      onHover={onHover}
      onClick={() => n.dismiss()}
    >
      <box vertical={true}>
        <box vertical={false}>
          <label
            css={`
              margin-left: 8px;
            `}
            halign={START}
            truncate
            label={n.appName || "Unknown"}
          />
          <label
            css={`
              margin-right: 4px;
            `}
            hexpand
            halign={END}
            label={time(n.time)}
          />
          <button
            className="panelButton"
            onClicked={() => n.dismiss()}
            label=""
          />
        </box>
        <box
          vertical={true}
          css={`
            padding: 10px;
          `}
        >
          <box vertical={false}>
            {/* <NotificationIcon notification={n} /> */}
            <label
              halign={START}
              xalign={0}
              label={insertNewlines(n.summary, 33)} // wrap causes issues with scrollable height so split lines manually
            />
            {n.body && (
              <label
                halign={START}
                xalign={0}
                label={insertNewlines(n.body, 40)}
              />
            )}
          </box>
        </box>
        {n.get_actions().length > 0 && (
          <box vertical={true}>
            {n.get_actions().map(({ label, id }) => (
              <button
                className="primaryButton"
                hexpand={true}
                css={`
                  margin: 4px 8px 8px 8px;
                `}
                onClicked={() => n.invoke(id)}
                label={label}
              />
            ))}
          </box>
        )}
      </box>
    </eventbox>
  );
}

export function DisplayNotifications(gdkmonitor: Gdk.Monitor) {
  const { TOP, RIGHT } = Astal.WindowAnchor;
  const notifs = new NotifiationMap();

  return (
    <window
      className="NotificationPopups"
      gdkmonitor={gdkmonitor}
      exclusivity={Astal.Exclusivity.EXCLUSIVE}
      anchor={TOP | RIGHT}
    >
      <box vertical={true}>{bind(notifs)}</box>
    </window>
  );
}
