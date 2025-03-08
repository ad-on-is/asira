import DateTime from "core/plugins/datetime/Widgets";

import OsButton from "common/OsButton";
import { App, Astal, Gtk } from "astal/gtk3";
import { BottomBar, SideBarLeft, SideBarRight, TopBar } from "core/Bar";

import { ConnectionButton } from "core/plugins/connection/Widgets";
import HyprlandWorkspaces from "core/plugins/hyprland/Workspaces";
import Storage from "core/plugins/storage/Widgets";
import { CameraButton, MicrophoneButton, VolumeButton } from "core/plugins/audio/Widgets";

import SysTray from "core/SysTray";
import Razer from "core/plugins/razer/Widgets";
import Gtop from "core/plugins/gtop/Widgets";
import TaskBar from "core/plugins/hyprland/TaskBar";
import MediaPlayer from "core/plugins/mediaplayer/Widgets";

import _ from "lodash";
import coreOptions from "core/init";
import { handler as coreHandler, init as coreInit } from "core/init";
import { Gdk } from "astal/gtk3";
import Launcher from "core/Launcher";
import { init as appsInit, register as appsRegister } from "core/plugins/launcher/Apps"
import { init as customCommandsInit, register as customCommandsRegister } from "core/plugins/launcher/CustomCommands"
import { bind, execAsync, Variable } from "astal";

const wideScreens = ["34GP950G", "LG ULTRAWIDE"];

const easyvar = Variable(false).poll(1000, ["bash", "-c", "ps aux | grep easyeffects | { grep -v grep || true; }"], (o) => o !== "")

export function initLauncher() {
  Launcher();
  appsRegister()
  customCommandsRegister()
}

export function init() {
  coreInit();

  const bars = new Map<Gdk.Monitor, Gtk.Widget>()
  for (const m of App.get_monitors()) {
    bars.set(m, BottomBar(m))
  }

  App.connect("monitor-added", (_, m) => {
    bars.set(m, BottomBar(m))
  })
  App.connect("monitor-removed", (_, m) => {
    bars.get(m)?.destroy()
    bars.delete(m)
  })


}

export function handler(request: string, res: (response: any) => void) {
  coreHandler(request, res);
}

export function handlerLauncher(request: string, res: (response: any) => void) {
  App.toggle_window("launcher");
  appsInit()
  customCommandsInit()
  res("ok");

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
            (m: Gdk.Monitor) => (<button onClicked={() => { execAsync("easyeffects") }} className="panelButton easyeffects" visible={bind(easyvar).as((ev) => ev)}><box><label className="icon" label="󰺢" /></box></button>),
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
                <CameraButton />
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
                        name: "/run/media/adonis/NAS/Drive",
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
