import { bind } from "astal";
import { Gdk, Astal } from "astal/gtk3";

import { getNetworkIconBinding } from "./network";

import NetworkControls from "./NetworkControls";
import { activeVpnConnections } from "./network";
import Bluetooth from "gi://AstalBluetooth";
import { togglePopup } from "core/Popup";
import BluetoothControls from "./BluetoothControls";

export function VpnButton() {
  return (
    <label
      className="icon vpn"
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
      className="icon bluetooth"
      label="󰂯"
      visible={bind(bluetooth, "isPowered").as((isPowered) => {
        return isPowered;
      })}
    />
  );
}

export function NetworkButton() {
  return <label className="icon network" label={getNetworkIconBinding()} />;
}

export function ConnectionButton({ gdkmonitor }: { gdkmonitor?: Gdk.Monitor }) {
  return (
    <button
      className={`panelButton connection`}
      onClicked={() => {
        togglePopup(
          "connection",
          Astal.WindowAnchor.TOP |
            Astal.WindowAnchor.RIGHT |
            Astal.WindowAnchor.BOTTOM,

          <box vertical={true}>
            <NetworkControls />
            <BluetoothControls />
          </box>,
        );
      }}
    >
      <box>
        <BluetoothButton />
        <NetworkButton />
        <VpnButton />
      </box>
    </button>
  );
}
