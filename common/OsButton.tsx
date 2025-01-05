import { GLib } from "astal";
import { togglePopup } from "core/Popup";
import SystemWidget from "plugins/builtin/systemInfo/Widgets";
import options from "options";

export default function OsButton() {
  return (
    <button
      className="panelButton"
      onClicked={() => {
        togglePopup(
          "systemInfo",
          options.systemInfo.position,
          <SystemWidget />,
        );
      }}
    >
      <icon icon={GLib.get_os_info("LOGO") || "missing-symbolic"} />
    </button>
  );
}
