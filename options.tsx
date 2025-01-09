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
import Storage from "plugins/builtin/storage/Widgets";
import { MicrophoneButton, VolumeButton } from "plugins/builtin/audio/Widgets";
import { DisplayNotifications } from "core/Notification";

import { MicrophoneOSD, VolumeOSD } from "plugins/builtin/audio/OSD";
import { BrightnessOSD } from "plugins/builtin/brightness/OSD";
import SysTray from "core/SysTray";
import Razer from "plugins/builtin/razer/Widgets";
import { CPU } from "plugins/builtin/gtop/Widgets";
import TaskBar from "plugins/builtin/hyprland/TaskBar";

const options = {
  notification: {
    position: Astal.WindowAnchor.BOTTOM | Astal.WindowAnchor.RIGHT,
    margin: [0, 50, 50, 0],
  },
  storage: {
    position: Astal.WindowAnchor.BOTTOM | Astal.WindowAnchor.RIGHT,

    show: [
      { name: "/", label: "root" },
      { name: "/home", label: "home" },
      { name: "/run/media/adonis/Expansion", label: "Expansion" },
      { name: "/run/media/adonis/Backups", label: "Backups" },
      { name: "/run/media/adonis/NAS-Drive", label: "NAS", isNetwork: true },
    ],
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
  hyprland: {
    taskbar: {
      minimizedWorkspace: "minimized",
    },
    workspaces: {
      icons: {
        1: "󰈸",
        2: "󱋊",
        3: " ",
        4: "󰈸",
        5: "󱋊",
        6: "",
        7: "󰈸",
        8: "󱋊",
        9: "",
        10: "󰈸",
        11: "󱋊",
        12: "",
      },
    },
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
      start: [TaskBar],
      center: [],
      end: [CPU, Razer, Storage],
    },
  },
  topBar: {
    margin: [5, 10, 0, 10],
    widgets: {
      start: [OsButton, HyprlandWorkspaces],
      center: [DateTime],
      end: [
        SysTray,
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
  // App.get_monitors().map(DisplayNotifications);
  DisplayNotifications(mainMonitor);
  App.get_monitors().map(VolumeOSD);
  // VolumeOSD(mainMonitor)
  App.get_monitors().map(MicrophoneOSD);
  // MicrophoneOSD(mainMonitor);
  App.get_monitors().map(BrightnessOSD);
  // BrightnessOSD(mainMonitor)
}

export default options;
