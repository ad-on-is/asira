import DateTime from "plugins/builtin/datetime/Widgets";
import OsButton from "core/systemMenu/OsButton";
import {
  ScreenRecordingButton,
  BatteryButton,
} from "plugins/builtin/battery/Widgets";
import {
  BluetoothButton,
  VpnButton,
  NetworkButton,
} from "plugins/builtin/connection/Widgets";
import HyprlandWorkspaces from "plugins/builtin/hyprland/Workspaces";

export default {
  topBar: {
    left: [OsButton, HyprlandWorkspaces],
    center: [DateTime],
    right: [
      ScreenRecordingButton,
      BluetoothButton,
      VpnButton,
      NetworkButton,
      BatteryButton,
    ],
  },
};
