import DateTime from "plugins/builtin/datetime/Widgets";

import OsButton from "common/OsButton";
import { App, Astal } from "astal/gtk3";
import { BottomBar, SideBarLeft, SideBarRight, TopBar } from "core/Bar";

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
import { handler as coreHandler, init as coreInit } from "core/init";
import { Gdk } from "astal/gtk3";

const wideScreens = ["34GP950G", "LG ULTRAWIDE"];

export function init() {
  coreInit();
  const mainMonitor = App.get_monitors().find((m) => m.is_primary()) ||
    App.get_monitors()[0];

  App.get_monitors().map((m) =>
    BottomBar(
      m,
    )
  );

  // add your custom init
  // see core/init.ts for reference

  // App.get_monitors().map(BottomBar);
}

export function handler(request: string, res: (response: any) => void) {
  coreHandler(request, res);
}

export default _.merge(
  coreOptions, // add your custom options
  // see core/init for reference
  //
  {
    openweatherApiKey: "02a93a93f5a23b3dc88da0cdd3663308",
    bar: {
      top: {
        widgets: {
          start: [
            (m: Gdk.Monitor) => <OsButton />,
            (m: Gdk.Monitor) => (
              <HyprlandWorkspaces
                gdkmonitor={m}
                opts={{
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
                }}
              />
            ),
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
              <box>

                <VolumeButton
                  gdkmonitor={m}
                  opts={{ showDescription: wideScreens.includes(m.model) }}
                />
                <MicrophoneButton
                  gdkmonitor={m}
                  opts={{ showDescription: wideScreens.includes(m.model) }}
                />
              </box>
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
            (m: Gdk.Monitor) =>
              !wideScreens.includes(m.model) ? <box /> : <MediaPlayer />,
          ],
          end: [
            (m: Gdk.Monitor) => <Gtop />,
            (m: Gdk.Monitor) => <Razer />,
            (m: Gdk.Monitor) =>
              !wideScreens.includes(m.model) ? <box /> : (
                <Storage
                  gdkmonitor={m}
                  opts={{
                    position: Astal.WindowAnchor.BOTTOM |
                      Astal.WindowAnchor.RIGHT,
                    paths: [
                      { name: "/", label: "root" },
                      { name: "/home", label: "home" },
                      {
                        name: "/run/media/adonis/Expansion",
                        label: "Expansion",
                      },
                      { name: "/run/media/adonis/Backups", label: "Backups" },
                      {
                        name: "/run/media/adonis/NAS-Drive",
                        label: "NAS",
                        isNetwork: true,
                      },
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
