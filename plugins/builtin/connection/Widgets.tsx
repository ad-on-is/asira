import { bind } from "astal";

import { getNetworkIconBinding } from "./network";

import { activeVpnConnections } from "./NetworkControls";
import Bluetooth from "gi://AstalBluetooth";

export function VpnButton() {
  return (
    <label
      className="panelButton"
      label="󰯄"
      visible={activeVpnConnections().as((connections) => {
        return connections.length !== 0;
      })}
    />
  );
}

export function BluetoothButton() {
  const bluetooth = Bluetooth.get_default();
  return (
    <label
      className="panelButton"
      label="󰂯"
      visible={bind(bluetooth, "isPowered").as((isPowered) => {
        return isPowered;
      })}
    />
  );
}

export function NetworkButton() {
  return <label className="panelButton" label={getNetworkIconBinding()} />;
}
