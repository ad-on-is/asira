import DateTime from "plugins/builtin/datetime/Widgets";

import OsButton from "common/OsButton";
import { App, Astal } from "astal/gtk3";
import { TopBar, BottomBar, SideBarLeft, SideBarRight } from "core/Bar";

import {
  ScreenRecordingButton,
  BatteryButton,
} from "plugins/builtin/battery/Widgets";
import { ConnectionButton } from "plugins/builtin/connection/Widgets";
import HyprlandWorkspaces from "plugins/builtin/hyprland/Workspaces";
import { MicrophoneButton, VolumeButton } from "plugins/builtin/audio/Widgets";
import { DisplayNotifications } from "core/Notification";

import { MicrophoneOSD, VolumeOSD } from "plugins/builtin/audio/OSD";
import { BrightnessOSD } from "plugins/builtin/brightness/OSD";

const options = {
  notification: {
    position: Astal.WindowAnchor.BOTTOM | Astal.WindowAnchor.RIGHT,
    margin: [0, 50, 50, 0],
  },
  dateTime: {
    showWeather: true,
    timeFormat: "%H:%M:%S",
    dateFormat: "%a, %d.%b %Y",
  },
  systemInfo: {
    position:
      Astal.WindowAnchor.TOP |
      Astal.WindowAnchor.LEFT |
      Astal.WindowAnchor.BOTTOM,
  },
  overview: {
    position: Astal.WindowAnchor.TOP,
  },
  osd: {
    position: Astal.WindowAnchor.BOTTOM,
    margin: [0, 0, 100, 0],
  },
  audio: {
    // use "*" for all monitors
    showDescriptionOnMonitors: ["34GP950G", "LG ULTRAWIDE"],
  },
  leftBar: {
    margin: [5, 10, 10, 10],
    widgets: { start: [DateTime], center: [], end: [] },
  },
  rightBar: {
    margin: [5, 10, 10, 10],
    widgets: { start: [], center: [], end: [] },
  },
  bottomBar: {
    margin: [5, 10, 10, 10],
    widgets: {
      start: [],
      center: [DateTime],
      end: [],
    },
  },
  topBar: {
    margin: [5, 10, 0, 10],
    widgets: {
      start: [OsButton, HyprlandWorkspaces],
      center: [DateTime],
      end: [
        VolumeButton,
        MicrophoneButton,
        ScreenRecordingButton,
        ConnectionButton,
        BatteryButton,
      ],
    },
  },
};

export function init() {
  const mainMonitor =
    App.get_monitors().find((m) => m.is_primary()) || App.get_monitors()[0];

  // Use TopBar|BottomBar|SieBarLeft|SideBarRight
  App.get_monitors().map(TopBar);
  App.get_monitors().map(BottomBar);
  // TopBar(mainMonitor);
  App.get_monitors().map(DisplayNotifications);
  // DisplayNotifications(mainMonitor)
  App.get_monitors().map(VolumeOSD);
  // VolumeOSD(mainMonitor)
  App.get_monitors().map(MicrophoneOSD);
  // MicrophoneOSD(mainMonitor);
  App.get_monitors().map(BrightnessOSD);
  // BrightnessOSD(mainMonitor)
}

export default options;
