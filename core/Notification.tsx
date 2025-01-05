import { GLib, Variable, bind } from "astal";
import { Astal, Gtk, Gdk } from "astal/gtk3";
import { type EventBox } from "astal/gtk3/widget";
import Notifd from "gi://AstalNotifd";
import { insertNewlines } from "core/utils/strings";
import options from "options";

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
};

function NotificationIcon({
  notification,
}: {
  notification: Notifd.Notification;
}) {
  const image = notification.image || notification.appIcon;
  if (image) {
    return (
      <box
        className="icon"
        css={`
          background-image: url("${image}");
          background-size: cover;
          background-repeat: no-repeat;
          background-position: 0 0;
          min-width: 4rem;
          min-height: 4rem;
          margin-right: 1rem;
        `}
      ></box>
    );
  }
  return <box></box>;
}

export function Notification(props: Props) {
  const { notification: n, onHoverLost, onHover, setup } = props;
  const { START, END } = Gtk.Align;

  return (
    <eventbox
      className={`notification ${urgency(n)}`}
      setup={setup}
      onHoverLost={onHoverLost}
      onHover={onHover}
      onClick={() => n.dismiss()}
    >
      <box vertical={true}>
        <box vertical={false}>
          <label className="icon" label="" />
          <label
            css={`
              margin-left: 8px;
            `}
            className="small appname"
            halign={START}
            truncate
            label={n.appName || "Unknown"}
          />
          <label
            css={`
              margin-right: 4px;
            `}
            hexpand
            className="small time"
            halign={END}
            label={time(n.time)}
          />
          <button className="icon" onClicked={() => n.dismiss()} label="" />
        </box>
        <box
          vertical={true}
          css={`
            padding: 10px;
          `}
        >
          <box vertical={false}>
            <NotificationIcon notification={n} />
            <box vertical={true}>
              <label
                className="summary"
                halign={START}
                xalign={0}
                label={insertNewlines(n.summary, 33)} // wrap causes issues with scrollable height so split lines manually
              />
              {n.body && (
                <label
                  className="message"
                  halign={START}
                  xalign={0}
                  label={insertNewlines(n.body, 40)}
                />
              )}
            </box>
          </box>
        </box>
        {n.get_actions().length > 0 && (
          <box vertical={true}>
            {n.get_actions().map(({ label, id }) => (
              <button
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
  const notifs = new NotifiationMap();

  return (
    <window
      className="window"
      gdkmonitor={gdkmonitor}
      exclusivity={Astal.Exclusivity.EXCLUSIVE}
      margin_top={options.notification.margin[0]}
      margin_right={options.notification.margin[1]}
      margin_bottom={options.notification.margin[2]}
      margin_left={options.notification.margin[3]}
      anchor={options.notification.position}
    >
      <box vertical={true}>{bind(notifs)}</box>
    </window>
  );
}

export function NotificationHistory() {
  const notifications = Notifd.get_default();

  return (
    <box vertical={true}>
      <box vertical={false}>
        <button
          onClicked={() => {
            notifications.set_dont_disturb(!notifications.dontDisturb);
          }}
        >
          <box>
            <label
              className="icon"
              label={bind(notifications, "dontDisturb").as((dnd) => {
                return dnd ? "󰂛" : "󰂚";
              })}
            />
            <label label="DND" />
          </box>
        </button>
        <box hexpand={true} />
        <button
          className="panelButton"
          onClicked={() => {
            notifications.notifications.forEach((notification) => {
              notification.dismiss();
            });
          }}
        >
          <box>
            <label className="icon" label="" />
            <label label="Clear all" />
          </box>
        </button>
      </box>

      <scrollable vexpand={true} hscroll={Gtk.PolicyType.NEVER}>
        <box vertical={true}>
          {bind(notifications, "notifications").as((notificationsList) => {
            if (notificationsList.length === 0) {
              return (
                <box
                  vertical={true}
                  css={`
                    margin-top: 5rem;
                  `}
                >
                  <label className="icon xxxlarge" label="󱇦" />
                  <label className="xlarge" label="All caught up" />
                  <label label="No new notifications" />
                </box>
              );
            } else {
              return notificationsList.map((notification) => {
                return (
                  <Notification
                    setup={() => {}}
                    onHoverLost={() => {}}
                    onHover={() => {}}
                    notification={notification}
                  />
                );
              });
            }
          })}
        </box>
      </scrollable>
    </box>
  );
}
