import Hyprland from "gi://AstalHyprland";
import { bind } from "astal";
import { Gdk } from "astal/gtk3";
import { getMonitorName } from "./hyprland";

export default function HyprlandWorkspaces({
  gdkmonitor,
  opts
}: {
  gdkmonitor?: Gdk.Monitor;
  opts?: any
}) {
  const hypr = Hyprland.get_default();

  const icons: { [id: number]: string } = opts?.icons || {};

  return (
    <box vertical={false} className="workspaces">
      {bind(hypr, "workspaces").as((workspaces) => {
        const monitor = hypr
          .get_monitors()
          .find((m) => m.name === getMonitorName(gdkmonitor!));
        const monitorWorkspaces = workspaces
          .filter((w) => w.monitor?.id === monitor?.id && w.id > 0)
          .sort((a, b) => a.id - b.id);

        return monitorWorkspaces.map((workspace) => (
          <button
            label={bind(workspace.monitor, "activeWorkspace").as(
              (activeWorkspace) =>
                activeWorkspace?.id == workspace.id
                  ? icons[workspace.id] || "●"
                  : icons[workspace.id] || "○",
            )}
            className={bind(workspace.monitor, "activeWorkspace").as(
              (activeWorkspace) =>
                `panelButton workspace ws-${workspace.id} ${workspace.lastClient ? "" : "empty"} ${activeWorkspace?.id == workspace.id ? "active" : ""}`,
            )}
            onClicked={() => {
              hypr.dispatch("workspace", `${workspace.id}`);
            }}
          ></button>
        ));
      })}
    </box>
  );
}
