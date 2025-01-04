import DateTime from "plugins/builtin/datetime/Widgets";
import OsButton from "core/systemMenu/OsButton";
import { App } from "astal/gtk3";
import { TopBar, BottomBar, SideBarLeft, SideBarRight } from "core/bar/Bar";

import {
  ScreenRecordingButton,
  BatteryButton,
} from "plugins/builtin/battery/Widgets";
import {
  BluetoothButton,
  VpnButton,
  NetworkButton,
} from "plugins/builtin/connection/Widgets";
import HyprlandWorkspaces from "plugins/builtin/hyprland/Workspaces";
import { MicrophoneButton, VolumeButton } from "plugins/builtin/audio/Widgets";
import DisplayNotifications from "core/notification/NotificationPopups";

import { MicrophoneOSD, VolumeOSD } from "plugins/builtin/audio/OSD";
import { BrightnessOSD } from "plugins/builtin/brightness/OSD";

const options = {
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
        BluetoothButton,
        VpnButton,
        NetworkButton,
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
