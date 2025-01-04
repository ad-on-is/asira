import { App } from "astal/gtk3";
import { SystemMenuWindowName } from "constants";

import { GLib } from "astal";

export default function OsButton() {
  return (
    <button
      className="panelButton"
      onClicked={() => {
        App.toggle_window(SystemMenuWindowName);
      }}
    >
      <icon icon={GLib.get_os_info("LOGO") || "missing-symbolic"} />
    </button>
  );
}
