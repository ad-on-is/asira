import { getMonitorName, HyprTaskbar } from "./hyprland";
import Hyprland from "gi://AstalHyprland";

import { bind, GLib, Variable, derive } from "astal";
import { Gdk } from "astal/gtk3";
import { truncateString } from "core/utils/strings";
import appIcons from "core/utils/appIcons";

/**@param: {{textOnlyOn: []}} opts */

export default function ({ gdkmonitor, opts }: { gdkmonitor?: Gdk.Monitor, opts?: any }) {
  const taskbar = HyprTaskbar.get_default();
  const hypr = Hyprland.get_default();
  const minimizedWs = opts?.minimizedWorkspace || "minimized";
  const showTitle = opts?.textOnlyOn === undefined ||
    (opts?.textOnlyOn || []).includes(
      gdkmonitor?.model || "*",
    );
  return (
    <box vertical={false} className="taskbar">
      {bind(hypr, "workspaces").as((workspaces) => {
        const monitor = hypr
          .get_monitors()
          .find((m) => m.name === getMonitorName(gdkmonitor!));
        const monitorWorkspaces = workspaces
          .filter((w) => w.monitor?.id === monitor!.id)
          .sort((a, b) => a.id - b.id);

        return monitorWorkspaces.map((workspace) => {
          return (
            <box
              visible={bind(workspace.monitor, "activeWorkspace").as(
                (activeWorkspace) => activeWorkspace?.id === workspace.id,
              )}
            >
              {bind(taskbar, "clients").as((clients) =>
                clients
                  .filter(
                    (c) =>
                      c.workspace.id == workspace.id ||
                      c.workspace.name === `special:${minimizedWs}`,
                  )
                  .map((c) => {
                    const states = Variable.derive([
                      bind(c, "floating"),
                      bind(c, "pinned"),
                    ]);
                    return (
                      <button
                        className={`panelButton app ${c.floating && !c.pinned ? "floating" : ""} ${c.pinned ? "pinned" : ""} ${c.focused ? "focused" : ""} ${c.workspace.id < 0 ? "minimized" : ""}`}
                        visible={!c.swallowed}
                        onClicked={(self) => {
                          taskbar.focus(c.address, minimizedWs)
                        }}
                      >
                        <box>
                          <icon
                            className="icon"
                            icon={appIcons.get([
                              c.initialTitle,
                              c.initialClass,]
                            )}
                          />
                          <label visible={showTitle}
                            label={truncateString(c.title.split(" — ")[0], 16)}
                          />
                          <label
                            className="pinned icon"
                            label="󰐃"
                            visible={states(([f, p]) => p)}
                          />
                          <label
                            className="floating icon"
                            label="󰀁"
                            visible={states(([f, p]) => f && !p)}
                          />
                        </box>
                      </button>
                    );
                  }),
              )}
            </box>
          );
        });
      })}
    </box>
  );
}
