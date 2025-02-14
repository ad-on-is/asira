import { GLib } from "astal";
import { togglePopup } from "core/Popup";
import SystemWidget from "core/plugins/systemInfo/Widgets";
import options from "init";

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
