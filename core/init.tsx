import { App, Astal, Gdk, Gtk } from "astal/gtk3";
import { BottomBar, SideBarLeft, SideBarRight, TopBar } from "core/Bar";

import { DisplayNotifications } from "core/Notification";

import { MicrophoneOSD, VolumeOSD } from "core/plugins/audio/OSD";
import { BrightnessOSD } from "core/plugins/brightness/OSD";

export function init() {
  const mainMonitor = App.get_monitors().find((m) => m.is_primary()) ||
    App.get_monitors()[0];
  const bars = new Map<Gdk.Monitor, Gtk.Widget>()
  const osds = new Map<Gdk.Monitor, Array<Gtk.Widget>>()

  for (const m of App.get_monitors()) {
    bars.set(m, TopBar(m))
    osds.set(m, [VolumeOSD(m), MicrophoneOSD(m), BrightnessOSD(m)])
  }

  App.connect("monitor-added", (_, m) => {
    bars.set(m, TopBar(m))


  })
  App.connect("monitor-removed", (_, m) => {
    bars.get(m)?.destroy()
    bars.delete(m)
    for (const osd of osds.get(m) || []) {
      osd?.destroy()
    }
    osds.delete(m)
  })

  DisplayNotifications(mainMonitor);
}

export function handler(request: string, res: (response: any) => void) {
}

export default {
  openweatherApiKey: "",
  notification: {
    position: Astal.WindowAnchor.BOTTOM | Astal.WindowAnchor.RIGHT,
    margin: [0, 50, 50, 0],
  },
  systemInfo: {
    position: Astal.WindowAnchor.TOP |
      Astal.WindowAnchor.LEFT |
      Astal.WindowAnchor.BOTTOM,
  },
  osd: {
    position: Astal.WindowAnchor.BOTTOM,
    stayOpenMs: 2000,
    margin: [0, 0, 100, 0],
  },
  bar: {
    top: {
      margin: [5, 10, 0, 10],
      widgets: {
        start: [],
        center: [],
        end: [],
      },
    },
    bottom: {
      margin: [0, 10, 5, 10],
      widgets: {
        start: [],
        center: [],
        end: [],
      },
    },
    left: {
      margin: [5, 10, 10, 10],
      widgets: {
        start: [],
        center: [],
        end: [],
      },
    },
    right: {
      margin: [5, 10, 10, 10],
      widgets: {
        start: [],
        center: [],
        end: [],
      },
    },
  },
};
