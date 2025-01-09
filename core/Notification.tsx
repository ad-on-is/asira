import { GLib, Variable, bind } from "astal";
import { Astal, Gtk, Gdk } from "astal/gtk3";
import Notifd from "gi://AstalNotifd";
import { insertNewlines } from "core/utils/strings";
import options from "options";

import { type Subscribable } from "astal/binding";

const TIMEOUT_DELAY = 7_000;

class NotifiationMap implements Subscribable {
  // the underlying map to keep track of id widget pairs
  private map: Map<number, Notifd.Notification> = new Map();

  // it makes sense to use a Variable under the hood and use its
  // reactivity implementation instead of keeping track of subscribers ourselves
  private var: Variable<Array<Notifd.Notification>> = Variable([]);

  // notify subscribers to rerender when state changes
  private notifiy() {
    this.var.set([...this.map.values()]);
  }

  constructor() {
    const notifd = Notifd.get_default();

    /**
     * uncomment this if you want to
     * ignore timeout by senders and enforce our own timeout
     * note that if the notification has any actions
     * they might not work, since the sender already treats them as resolved
     */
    // notifd.ignoreTimeout = true;

    notifd.connect("notified", (_, id) => {
      let hideTimeout: GLib.Source | null = null;

      if (notifd.dontDisturb) {
        return;
      }

      this.set(id, notifd.get_notification(id)!);
    });

    // notifications can be closed by the outside before
    // any user input, which have to be handled too
    notifd.connect("resolved", (_, id) => {
      this.delete(id);
    });
  }

  private set(key: number, value: Notifd.Notification) {
    this.map.set(key, value);
    this.notifiy();
  }

  delete(key: number) {
    this.map.delete(key);
    this.notifiy();
  }

  // needed by the Subscribable interface
  get() {
    return this.var.get();
  }

  // needed by the Subscribable interface
  subscribe(callback: (list: Array<Notifd.Notification>) => void) {
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
  autoDismiss: boolean;
  onAutoDismiss?: Function;
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
      <box vertical={true}>
        <box
          className="image"
          css={`
            background-image: url("${image}");
            background-size: cover;
            background-repeat: no-repeat;
            background-position: center;
          `}
        ></box>
      </box>
    );
  }
  return <box></box>;
}

export function Notification(props: Props) {
  let { notification: n, autoDismiss, onAutoDismiss } = props;
  const { START, END } = Gtk.Align;

  let setup,
    onHover,
    onHoverLost = () => {};

  if (autoDismiss) {
    let hideTimeout: GLib.Source | null = null;
    setup = () => {
      hideTimeout = setTimeout(() => {
        if (onAutoDismiss !== null) {
          onAutoDismiss!();
        }
        hideTimeout?.destroy();
        hideTimeout = null;
      }, TIMEOUT_DELAY);
    };
    onHover = () => {
      hideTimeout = null;
    };
    onHoverLost = () => {
      hideTimeout = setTimeout(() => {
        if (onAutoDismiss !== null) {
          onAutoDismiss!();
        }

        hideTimeout?.destroy();
        hideTimeout = null;
      }, TIMEOUT_DELAY);
    };
  }

  return (
    <eventbox
      // className={`notification window  ${urgency(n)}`}
      setup={setup}
      onHoverLost={onHoverLost}
      onHover={onHover}
      onClick={() => n.dismiss()}
    >
      <box vertical={true} className={`notification window  ${urgency(n)}`}>
        <box vertical={false} className="header">
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
                label={insertNewlines(n.summary, 30)} // wrap causes issues with scrollable height so split lines manually
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
          <box>
            {n
              .get_actions()
              .filter((a) => a.label !== "")
              .map(({ label, id }) => (
                <button
                  // hexpand={true}
                  css={`
                    margin: 4px 8px 8px 8px;
                  `}
                  onClicked={() => {
                    console.log(id);
                    n.invoke(id);
                  }}
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
  const notifications = Notifd.get_default();

  return (
    <window
      gdkmonitor={gdkmonitor}
      css={`
        background-color: transparent;
      `}
      exclusivity={Astal.Exclusivity.EXCLUSIVE}
      margin_top={options.notification.margin[0]}
      margin_right={options.notification.margin[1]}
      margin_bottom={options.notification.margin[2]}
      margin_left={options.notification.margin[3]}
      anchor={options.notification.position}
    >
      <box vertical={true}>
        {bind(notifs).as((list) =>
          list.map((n) => (
            <Notification
              notification={n}
              autoDismiss={true}
              onAutoDismiss={() => notifs.delete(n.id)}
            />
          )),
        )}
      </box>
    </window>
  );
}

export function NotificationHistory() {
  const notifications = Notifd.get_default();

  return (
    <box vertical={true} className="notificationHistory">
      <scrollable vexpand={true} hscroll={Gtk.PolicyType.NEVER}>
        <box vertical={true} className="list">
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
                    autoDismiss={false}
                    notification={notification}
                  />
                );
              });
            }
          })}
        </box>
      </scrollable>

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
    </box>
  );
}
