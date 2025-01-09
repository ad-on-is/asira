import Hyprland from "gi://AstalHyprland";
import GObject, { register, property } from "astal/gobject";
import { Gdk } from "astal/gtk3";
import Apps from "gi://AstalApps";

interface MyClient extends Hyprland.Client {
  focused: boolean;
}

export function getMonitorName(gdkmonitor: Gdk.Monitor) {
  const display = Gdk.Display.get_default();
  const screen = display!.get_default_screen();
  for (let i = 0; i < display!.get_n_monitors(); ++i) {
    if (gdkmonitor === display!.get_monitor(i))
      return screen.get_monitor_plug_name(i);
  }
}

@register({ GTypeName: "HyprTaskbar" })
export class HyprTaskbar extends GObject.Object {
  static instance: HyprTaskbar;
  static get_default() {
    if (!this.instance) this.instance = new HyprTaskbar();

    return this.instance;
  }

  #clients: MyClient[] = [];
  apps: Apps.Application[] = [];
  cache: { [className: string]: string } = {};

  @property()
  get clients() {
    return this.#clients;
  }

  iconName(title: string, className: string) {
    if (this.cache[className]) {
      return this.cache[className];
    }
    const app = this.apps.find(
      (a) =>
        a.name.toLowerCase().includes(title.toLowerCase()) ||
        a.name.toLowerCase().includes(className.toLowerCase()),
    );

    if (app) {
      this.cache[className] = app.iconName;
      return app.iconName;
    }

    return "missing-symbolic";
  }

  setInactive() {
    this.#clients.map((c) => {
      c.focused = false;
      return c;
    });
  }

  filterAndNotify() {
    const swallowed = this.#clients
      .filter((c) => c.swallowing !== "0x0")
      .map((c) => c.swallowing.replaceAll("0x", ""));
    this.#clients = this.#clients.filter((c) => !swallowed.includes(c.address));
    this.notify("clients");
  }

  constructor() {
    super();
    const hypr = Hyprland.get_default();
    const apps = new Apps.Apps();

    const focused = hypr.workspaces.map((w) => w.lastClient?.address);

    hypr.clients.map((c) => {
      const mc = c as MyClient;
      mc.focused = focused.includes(c.address);
      this.#clients.push(mc);
    });

    this.apps = apps.list;

    this.filterAndNotify();

    hypr.connect("client-added", (_, cl) => {
      const mc = cl as MyClient;
      mc.focused = true;
      this.setInactive();
      this.#clients.push(mc);
      this.filterAndNotify();
    });
    hypr.connect("client-moved", (_, cl) => {
      this.#clients = this.#clients.filter((c) => c.address != cl.address);
      const mc = cl as MyClient;
      mc.focused = true;
      this.setInactive();
      this.#clients.push(mc);
      this.filterAndNotify();
    });

    hypr.connect("client-removed", (_, address) => {
      this.#clients = this.#clients.filter((c) => c.address != address);
      this.filterAndNotify();
    });

    hypr.connect("event", (_, event, details) => {
      // console.log(event);
      const events = [
        "activewindow",
        "activewindowv2",
        "windowtitle",
        "windowtitlev2",
        "activewindow",
        "activewindowv2",
        "changefloatingmode",
        "pin",
      ];
      if (!events.includes(event)) {
        return;
      }

      const address = details.split(",")[0];
      const old = this.#clients.find((c) => c.address === address);
      if (old) {
        const idx = this.#clients.indexOf(old);
        const cl = hypr.get_client(old.address);
        const mc = cl as MyClient;
        this.setInactive();
        this.#clients[idx] = mc;
        mc.focused = true;
        this.filterAndNotify();
      }
    });
  }
}

export type TaskbarInfo = {
  [id: number]: Hyprland.Client[];
};
