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

import SysTray from "core/SysTray";
import Razer from "plugins/builtin/razer/Widgets";
import Gtop from "plugins/builtin/gtop/Widgets";
import TaskBar from "plugins/builtin/hyprland/TaskBar";
import MediaPlayer from "plugins/builtin/mediaplayer/Widgets";

import _ from "lodash";
import coreOptions from "core/init";
import { init as coreInit } from "core/init"

export function init() {
  coreInit()

  const mainMonitor =
    App.get_monitors().find((m) => m.is_primary()) || App.get_monitors()[0];


  // add your custom init
  // see core/init.ts for reference

  App.get_monitors().map(BottomBar);
}

export default _.merge(coreOptions,

  // add your custom options
  // see core/init for reference
  //
  {
    openweatherApiKey: "02a93a93f5a23b3dc88da0cdd3663308",
    topBar: {
      widgets: {
        start: [{ Component: OsButton }, {
          Component: HyprlandWorkspaces, o: {
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
          }
        }],
        center: [{
          Component: DateTime, o: {
            showWeather: true,
            timeFormat: "%H:%M:%S",
            dateFormat: "%a, %d.%b %Y",
            overview: {
              position: Astal.WindowAnchor.TOP,
            },
          }
        }],
        end: [
          { Component: SysTray },
          { Component: VolumeButton, o: { textOnlyOn: ["34GP950G", "LG ULTRAWIDE"], } },
          { Component: MicrophoneButton, o: { textOnlyOn: ["34GP950G", "LG ULTRAWIDE"], } },
          { Component: ScreenRecordingButton },
          { Component: ConnectionButton },
          { Component: BatteryButton },
        ],
      },
    },

    leftBar: {
      widgets: { start: [], center: [], end: [] },
    },
    rightBar: {
      widgets: { start: [], center: [], end: [] },
    },
    bottomBar: {
      widgets: {
        start: [{ Component: TaskBar, o: { minimizedWorkspace: "minimized", textOnlyOn: ["34GP950G", "LG ULTRAWIDE"] } }],
        center: [{ Component: MediaPlayer, m: ["34GP950G", "LG ULTRAWIDE"] }],
        end: [{ Component: Gtop }, { Component: Razer }, {
          Component: Storage, m: ["34GP950G", "LG ULTRAWIDE"], o: {
            position: Astal.WindowAnchor.BOTTOM | Astal.WindowAnchor.RIGHT, paths: [
              { name: "/", label: "root" },
              { name: "/home", label: "home" },
              { name: "/run/media/adonis/Expansion", label: "Expansion" },
              { name: "/run/media/adonis/Backups", label: "Backups" },
              { name: "/run/media/adonis/NAS-Drive", label: "NAS", isNetwork: true },
            ],
          }
        }],
      },
    },
  });
