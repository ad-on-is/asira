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
import MediaPlayer from "plugins/builtin/mediaplayer/Widgets";

import _ from "lodash";
import coreOptions from "core/options";

export default _.merge(coreOptions, {
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
  audio: {
    // use "*" for all monitors
    showDescriptionOnMonitors: ["34GP950G", "LG ULTRAWIDE"],
  },
  leftBar: {
    widgets: { start: [DateTime], center: [], end: [] },
  },
  rightBar: {
    widgets: { start: [], center: [], end: [] },
  },
  bottomBar: {
    widgets: {
      start: [TaskBar],
      center: [MediaPlayer],
      end: [CPU, Razer, Storage],
    },
  },
  topBar: {
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
});
