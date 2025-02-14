import DateTime from "core/plugins/datetime/Widgets";

import OsButton from "common/OsButton";
import { App, Astal, Gdk } from "astal/gtk3";
import { BottomBar, SideBarLeft, SideBarRight, TopBar } from "core/Bar";

import { ConnectionButton } from "core/plugins/connection/Widgets";
import HyprlandWorkspaces from "core/plugins/hyprland/Workspaces";
import Storage from "core/plugins/storage/Widgets";
import { MicrophoneButton, VolumeButton } from "core/plugins/audio/Widgets";

import SysTray from "core/SysTray";
import Razer from "core/plugins/razer/Widgets";
import Gtop from "core/plugins/gtop/Widgets";
import TaskBar from "core/plugins/hyprland/TaskBar";
import MediaPlayer from "core/plugins/mediaplayer/Widgets";

import _ from "lodash";
import coreOptions from "core/init";
import { init as coreInit } from "core/init";

export function init() {
  coreInit();

  const mainMonitor = App.get_monitors().find((m) => m.is_primary()) ||
    App.get_monitors()[0];

  // add your custom init
  // see core/init.ts for reference

  App.get_monitors().map(BottomBar);
}

export function handler(request: string, res: (response: any) => void) {
}

export default _.merge(
  coreOptions, // add your custom options
  // see core/init for reference
  //
  {
    openweatherApiKey: "",

    bar: {
      top: {
        widgets: {
          start: [
            (m: Gdk.Monitor) => <OsButton />,
            // (m: Gdk.Monitor) => (
            //   <HyprlandWorkspaces
            //     gdkmonitor={m}
            //     opts={{
            //       icons: {
            //         1: "󰈸",
            //         2: "󱋊",
            //         3: " ",
            //         4: "󰈸",
            //         5: "󱋊",
            //         6: "",
            //         7: "󰈸",
            //         8: "󱋊",
            //         9: "",
            //         10: "󰈸",
            //         11: "󱋊",
            //         12: "",
            //       },
            //     }}
            //   />
            // ),
          ],
          center: [(m: Gdk.Monitor) => (
            <DateTime
              gdkmonitor={m}
              opts={{
                showWeather: true,
                timeFormat: "%H:%M:%S",
                dateFormat: "%a, %d.%b %Y",
                overview: {
                  position: Astal.WindowAnchor.TOP,
                },
              }}
            />
          )],
          end: [
            (m: Gdk.Monitor) => <SysTray />,
            (m: Gdk.Monitor) => (
              <VolumeButton
                gdkmonitor={m}
                opts={{ showDescription: true }}
              />
            ),
            (m: Gdk.Monitor) => (
              <MicrophoneButton
                gdkmonitor={m}
                opts={{ showDescription: true }}
              />
            ),
            (m: Gdk.Monitor) => <ConnectionButton />,
          ],
        },
      },
      bottom: {
        widgets: {
          start: [(m: Gdk.Monitor) => (
            <TaskBar
              gdkmonitor={m}
              opts={{
                minimizedWorkspace: "minimized",
                textOnlyOn: ["34GP950G", "LG ULTRAWIDE"],
              }}
            />
          )],
          center: [
            (m: Gdk.Monitor) => <MediaPlayer />,
          ],
          end: [
            (m: Gdk.Monitor) => <Gtop />,
            (m: Gdk.Monitor) => <Razer />,
            (m: Gdk.Monitor) => (
              <Storage
                gdkmonitor={m}
                opts={{
                  position: Astal.WindowAnchor.BOTTOM |
                    Astal.WindowAnchor.RIGHT,
                  paths: [
                    { name: "/", label: "root" },
                    { name: "/home", label: "home" },
                  ],
                }}
              />
            ),
          ],
        },
      },
      left: {
        widgets: {
          start: [],
          center: [],
          end: [],
        },
      },
      right: {
        widgets: {
          start: [],
          center: [],
          end: [],
        },
      },
    },
  },
);
