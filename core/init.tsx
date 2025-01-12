import { App, Astal } from "astal/gtk3";
import { BottomBar, SideBarLeft, SideBarRight, TopBar } from "core/Bar";

import { DisplayNotifications } from "core/Notification";

import { MicrophoneOSD, VolumeOSD } from "plugins/builtin/audio/OSD";
import { BrightnessOSD } from "plugins/builtin/brightness/OSD";

export function init() {
  const mainMonitor = App.get_monitors().find((m) => m.is_primary()) ||
    App.get_monitors()[0];

  // TopBar(mainMonitor);
  // Use TopBar|BottomBar|SieBarLeft|SideBarRight
  App.get_monitors().map((m) =>
    TopBar(
      m,
    )
  );

  // App.get_monitors().map(DisplayNotifications);
  DisplayNotifications(mainMonitor);
  App.get_monitors().map(VolumeOSD);
  // VolumeOSD(mainMonitor)
  App.get_monitors().map(MicrophoneOSD);
  // MicrophoneOSD(mainMonitor);
  App.get_monitors().map(BrightnessOSD);
  // BrightnessOSD(mainMonitor)
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
