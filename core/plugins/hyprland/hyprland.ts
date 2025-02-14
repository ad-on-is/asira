import Hyprland from "gi://AstalHyprland";
import GObject, { property, register } from "astal/gobject";
import { Gdk } from "astal/gtk3";

interface MyClient extends Hyprland.Client {
  focused: boolean;
  swallowed: boolean;
}

export function getMonitorName(gdkmonitor: Gdk.Monitor) {
  const display = Gdk.Display.get_default();
  const screen = display!.get_default_screen();
  for (let i = 0; i < display!.get_n_monitors(); ++i) {
    if (gdkmonitor === display!.get_monitor(i)) {
      return screen.get_monitor_plug_name(i);
    }
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
  cache: { [className: string]: string } = {};

  @property()
  get clients() {
    return this.#clients;
  }


  setInactive() {
    this.#clients.map((c) => {
      c.focused = false;
      return c;
    });
  }

  filterAndNotify() {

    const swallowed = this.#clients
      .filter((c) => c.swallowing !== null && c.swallowing !== "0x0")
      .map((c) => c.swallowing.replaceAll("0x", ""));
    this.#clients = this.#clients.map((c) => {
      c.swallowed = swallowed.includes(c.address);
      return c;
    });
    this.notify("clients");
  }

  focus(address: string, minimizedWs: string) {
    const hypr = Hyprland.get_default();

    const c = hypr.get_client(address);
    if (!c) {
      this.#clients = hypr.get_clients().map((c) => c as MyClient);
      return;
    }
    if (c.workspace.id > 0) {
      hypr.dispatch(
        "focuswindow",
        `address:0x${c.address}`,
      );
    } else {
      hypr.dispatch(
        "togglespecialworkspace",
        minimizedWs,
      );
      hypr.dispatch("movetoworkspace", "+0");
    }

  }


  constructor() {
    super();
    const hypr = Hyprland.get_default();

    const focused = hypr.workspaces.map((w) => w.lastClient?.address);

    hypr.clients.map((c) => {
      const mc = c as MyClient;
      mc.focused = focused.includes(c.address);
      this.#clients.push(mc);
    });


    this.filterAndNotify();

    const addClient = (address: string) => {
      const cl = hypr.get_client(address)!
      const mc = cl as MyClient;
      mc.focused = true;
      this.setInactive();
      this.#clients.push(mc);
      this.filterAndNotify();

    }
    const moveClient = (address: string) => {
      const cl = hypr.get_client(address)!
      this.#clients = this.#clients.filter((c) => c.address != cl.address);
      const mc = cl as MyClient;
      mc.focused = true;
      this.setInactive();
      this.#clients.push(mc);
      this.filterAndNotify();
    }
    const closeClient = (address: string) => {

      this.#clients = this.#clients.filter((c) => c.address != address);
      this.filterAndNotify();

    }

    hypr.connect("event", (_, event, details) => {
      // console.log(event)
      const events = [
        "openwindow",
        "closewindow",
        "movewindowv2",
        "activewindow",
        "activewindowv2",
        "windowtitle",
        "windowtitlev2",
        "activewindow",
        "activewindowv2",
        "changefloatingmode",
        "pin",
        "moveoutofgroup",
      ];
      if (!events.includes(event)) {
        return;
      }
      const address = details.split(",")[0];

      switch (event) {
        case "openwindow": return addClient(address)
        case "movewindow": return moveClient(address)
        case "closewindow": return closeClient(address)
      }

      const old = this.#clients.find((c) => (c?.address || "") === address);
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
