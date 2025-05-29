import { GLib, Variable, bind, timeout } from "astal";
import { Astal, Gtk, Gdk } from "astal/gtk3";
import Notifd from "gi://AstalNotifd";
import Mpris from "gi://AstalMpris";

import { insertNewlines } from "core/utils/strings";
import options from "init";
import appIcons from "core/utils/appIcons";
import { type Subscribable } from "astal/binding";
import { execAsync, exec } from "astal";

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

  private current: number = 0;

  constructor() {
    const notifd = Notifd.get_default();
    const mpris = Mpris.get_default();

    /**
     * uncomment this if you want to
     * ignore timeout by senders and enforce our own timeout
     * note that if the notification has any actions
     * they might not work, since the sender already treats them as resolved
     */
    // notifd.ignoreTimeout = true;

    mpris.players.map((player) => {
      const listener = Variable.derive([
        bind(player, "title"),
        bind(player, "coverArt"),
        bind(player, "artist"),
        bind(player, "album"),
        bind(player, "playback_status"),
      ]);

      listener.subscribe(async ([t, c, ar, al]) => {
        timeout(300, async () => {
          const id = await execAsync(
            `notify-send "${t}" "${ar}\n${al}" --icon "${c}" --app-name "${player.identity}" --print-id ${this.current !== 0 ? `--replace-id=${this.current}` : ""}`,
          );
          this.current = parseInt(id);
        });
      });
    });

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
      if (this.current === id) {
        this.current = 0;
      }
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

  const appIcon = appIcons.get([n.appName]);
  const dismissClass = Variable("");
  return (
    <eventbox
      // className={`notification window  ${urgency(n)}`}
      setup={setup}
      onHoverLost={onHoverLost}
      onHover={onHover}
      onClick={() => {
        dismissClass.set("dismissed");
        let dt: GLib.Source | null = setTimeout(() => {
          n.dismiss();
          dt?.destroy();
          dt = null;
        }, 200);
      }}
    >
      <box
        vertical={true}
        className={bind(dismissClass).as(
          (d: string) => `notification window ${urgency(n)}  ${d}`,
        )}
      >
        <box vertical={false} className="header">
          {appIcon === "" ? (
            <label className="icon appicon" label="" />
          ) : (
            <icon className="icon appicon" icon={appIcon} />
          )}

          <label
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
          <button
            className="icon close"
            onClicked={() => {
              dismissClass.set("dismissed");
              setTimeout(() => {
                n.dismiss();
              }, 500);
            }}
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

// notifications popup list
export function DisplayNotifications(gdkmonitor: Gdk.Monitor) {
  const notifs = new NotifiationMap();

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
              const groups: any = {};
              notificationsList.forEach((n) => {
                if (!groups[n.appName]) {
                  groups[n.appName] = [];
                }
                console.log(n.time);
                groups[n.appName].push(n);
                groups[n.appName].sort((a: any, b: any) => a.time > b.time);
              });

              return Object.keys(groups).map((appName) => {
                return (
                  <stack
                    name={appName}
                    className={`stack ${groups[appName].length > 1 ? "not-empty" : ""}`}
                  >
                    {groups[appName].reverse().map((n: any) => {
                      return (
                        <Notification notification={n} autoDismiss={false} />
                      );
                    })}
                  </stack>
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
