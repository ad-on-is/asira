import Hyprland from "gi://AstalHyprland";
import { bind, GLib, Variable } from "astal";

export default function HyprlandWorkspaces({
  vertical = false,
}: {
  vertical?: boolean;
}) {
  const hypr = Hyprland.get_default();

  const icons: { [id: number]: string } = {
    1: "",
    2: "󱋊",
    3: " ",
    4: "",
    5: "󱋊",
    6: "",
    7: "",
    8: "󱋊",
    9: "",
    10: "",
    11: "󱋊",
    12: "",
  };

  const monitor = hypr.get_focused_monitor();

  return (
    <box vertical={vertical} className="workspaces">
      {bind(hypr, "workspaces").as((workspaces) => {
        const monitorWorkspaces = workspaces
          .filter((w) => w.monitor.id === monitor.id)
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
                activeWorkspace.id == workspace.id
                  ? "active panelButton"
                  : "panelButton",
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
