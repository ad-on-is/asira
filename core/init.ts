import { App, Astal } from "astal/gtk3";
import { TopBar, BottomBar, SideBarLeft, SideBarRight } from "core/Bar";

import { DisplayNotifications } from "core/Notification";

import { MicrophoneOSD, VolumeOSD } from "plugins/builtin/audio/OSD";
import { BrightnessOSD } from "plugins/builtin/brightness/OSD";

export function init() {
  const mainMonitor =
    App.get_monitors().find((m) => m.is_primary()) || App.get_monitors()[0];

  // Use TopBar|BottomBar|SieBarLeft|SideBarRight
  App.get_monitors().map(TopBar);

  // TopBar(mainMonitor);
  // App.get_monitors().map(DisplayNotifications);
  DisplayNotifications(mainMonitor);
  App.get_monitors().map(VolumeOSD);
  // VolumeOSD(mainMonitor)
  App.get_monitors().map(MicrophoneOSD);
  // MicrophoneOSD(mainMonitor);
  App.get_monitors().map(BrightnessOSD);
  // BrightnessOSD(mainMonitor)
}

export default {
  notification: {
    position: Astal.WindowAnchor.BOTTOM | Astal.WindowAnchor.RIGHT,
    margin: [0, 50, 50, 0],
  },
  systemInfo: {
    position:
      Astal.WindowAnchor.TOP |
      Astal.WindowAnchor.LEFT |
      Astal.WindowAnchor.BOTTOM,
  },
  osd: {
    position: Astal.WindowAnchor.BOTTOM,
    margin: [0, 0, 100, 0],
  },
  leftBar: {
    margin: [5, 10, 10, 10],
    widgets: { start: [], center: [], end: [] },
  },
  rightBar: {
    margin: [5, 10, 10, 10],
    widgets: { start: [], center: [], end: [] },
  },
  bottomBar: {
    margin: [5, 10, 10, 10],
    widgets: {
      start: [],
      center: [],
      end: [],
    },
  },
  topBar: {
    margin: [5, 10, 0, 10],
    widgets: {
      start: [],
      center: [],
      end: [],
    },
  },
};
