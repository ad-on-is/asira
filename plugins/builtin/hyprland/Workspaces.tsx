import Hyprland from "gi://AstalHyprland";
import { bind, GLib, Variable } from "astal";
import { Gdk } from "astal/gtk3";

function getMonitorName(gdkmonitor: Gdk.Monitor) {
  const display = Gdk.Display.get_default();
  const screen = display!.get_default_screen();
  for (let i = 0; i < display!.get_n_monitors(); ++i) {
    if (gdkmonitor === display!.get_monitor(i))
      return screen.get_monitor_plug_name(i);
  }
}

export default function HyprlandWorkspaces({
  gdkmonitor,
}: {
  gdkmonitor?: Gdk.Monitor;
}) {
  const hypr = Hyprland.get_default();

  const icons: { [id: number]: string } = {
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
  };

  return (
    <box vertical={false} className="workspaces">
      {bind(hypr, "workspaces").as((workspaces) => {
        const monitor = hypr
          .get_monitors()
          .find((m) => m.name === getMonitorName(gdkmonitor!));
        const monitorWorkspaces = workspaces
          .filter((w) => w.monitor.id === monitor!.id)
          .sort((a, b) => a.id - b.id);

        return monitorWorkspaces.map((workspace) => (
          <button
            label={bind(workspace.monitor, "activeWorkspace").as(
              (activeWorkspace) =>
                activeWorkspace.id == workspace.id
                  ? icons[workspace.id] || ""
                  : icons[workspace.id] || "",
            )}
            className={bind(workspace.monitor, "activeWorkspace").as(
              (activeWorkspace) =>
                `panelButton workspace ws-${workspace.id} ${workspace.lastClient ? "" : "empty"} ${activeWorkspace.id == workspace.id ? "active" : ""}`,
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
