import { bind, Variable } from "astal";
import { Gtk } from "astal/gtk3";
import { getBluetoothIcon, getBluetoothName } from "./bluetooth";
import Bluetooth from "gi://AstalBluetooth";
import { ArrowDropdown, ButtonDropdown } from "core/DropDown";

function BluetoothDevices() {
  const bluetooth = Bluetooth.get_default();

  return (
    <box vertical={true} className="bluetooth controls">
      {bind(bluetooth, "devices").as((devices) => {
        if (devices.length === 0) {
          return <label label="No devices" />;
        }
        return devices
          .filter((device) => {
            return device.name != null;
          })
          .map((device) => {
            const connectionState = Variable.derive([
              bind(device, "connected"),
              bind(device, "connecting"),
            ]);

            return (
              <ButtonDropdown
                icon=""
                label={`${device.name}`}
                content={
                  <box vertical={true}>
                    <button
                      hexpand={true}
                      visible={bind(device, "paired")}
                      label={connectionState((value) => {
                        const connected = value[0];
                        const connecting = value[1];
                        if (connecting) {
                          return "Connecting";
                        } else if (connected) {
                          return "Disconnect";
                        } else {
                          return "Connect";
                        }
                      })}
                      onClicked={() => {
                        if (device.connecting) {
                          // do nothing
                        } else if (device.connected) {
                          device.disconnect_device((device, result, data) => {
                            print("disconnected");
                          });
                        } else {
                          device.connect_device((device, result, data) => {
                            print("connected");
                          });
                        }
                      }}
                    />
                    <button
                      hexpand={true}
                      className="primaryButton"
                      css={`
                        margin-top: 4px;
                      `}
                      visible={bind(device, "paired")}
                      label={bind(device, "trusted").as((trusted) => {
                        if (trusted) {
                          return "Untrust";
                        } else {
                          return "Trust";
                        }
                      })}
                      onClicked={() => {
                        device.set_trusted(!device.trusted);
                      }}
                    />
                    <button
                      hexpand={true}
                      className="primaryButton"
                      css={`
                        margin-top: 4px;
                        margin-bottom: 4px;
                      `}
                      label={bind(device, "paired").as((paired) => {
                        return paired ? "Unpair" : "Pair";
                      })}
                      onClicked={() => {
                        if (device.paired) {
                          bluetooth.adapter.remove_device(device);
                        } else {
                          device.pair();
                        }
                      }}
                    />
                  </box>
                }
              />
            );
          });
      })}
    </box>
  );
}

export default function () {
  const bluetooth = Bluetooth.get_default();

  return (
    <box>
      {bind(bluetooth, "isPowered").as((isPowered) => {
        if (!isPowered) return <box />;

        return (
          <ArrowDropdown
            icon={getBluetoothIcon()}
            label={getBluetoothName()}
            onClicked={() => {}}
            content={
              <box vertical={true}>
                <box vertical={false}>
                  <label
                    halign={Gtk.Align.START}
                    hexpand={true}
                    label="Devices"
                  />
                  <button
                    css={`
                      padding-left: 8px;
                      padding-right: 8px;
                    `}
                    label={bind(bluetooth.adapter, "discovering").as(
                      (discovering) => {
                        return discovering ? "Stop scanning" : "Scan";
                      },
                    )}
                    onClicked={() => {
                      if (bluetooth.adapter.discovering) {
                        bluetooth.adapter.stop_discovery();
                      } else {
                        bluetooth.adapter.start_discovery();
                      }
                    }}
                  />
                </box>
                <BluetoothDevices />
              </box>
            }
          />
        );
      })}
    </box>
  );
}
