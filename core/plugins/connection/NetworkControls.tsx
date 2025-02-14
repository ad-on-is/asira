import AstalNetwork from "gi://AstalNetwork";
import {
  wifiConnections,
  activeVpnConnections,
  deleteConnection,
  connectVpn,
  updateConnections,
  vpnConnections,
  getAccessPointIcon,
  getNetworkIconBinding,
  getNetworkNameBinding,
} from "./network";
import { bind, Variable } from "astal";
import { Gtk, App } from "astal/gtk3";
import { execAsync } from "astal/process";
import { ArrowDropdown, ButtonDropdown } from "core/DropDown";

function PasswordEntry({
  accessPoint,
}: {
  accessPoint: AstalNetwork.AccessPoint;
}) {
  const text = Variable("");

  const connect = () => {
    execAsync([
      "bash",
      "-c",
      `echo '${text.get()}' | nmcli device wifi connect "${accessPoint.ssid}" --ask`,
    ])
      .catch((error) => {
        print(error);
      })
      .then((value) => {
        print(value);
      })
      .finally(() => {
        updateConnections();
      });
  };

  return (
    <box vertical={true} spacing={4}>
      {accessPoint.flags !== 0 && (
        <box vertical={true}>
          <label halign={Gtk.Align.START} label="Password" />
          <entry
            className="networkPasswordEntry"
            text={text()}
            onChanged={(self) => text.set(self.text)}
            onActivate={() => connect()}
          />
        </box>
      )}
      <button
        className="primaryButton"
        hexpand={true}
        label="Connect"
        onClicked={() => connect()}
      />
    </box>
  );
}

function WifiConnections() {
  const network = AstalNetwork.get_default();

  return (
    <box vertical={true}>
      <label halign={Gtk.Align.START} label="Saved networks" />
      {wifiConnections((connectionsValue) => {
        return connectionsValue.map((connection) => {
          let label: string;
          let icon: string;
          let canConnect: boolean;
          const accessPoint = network.wifi.accessPoints.find((accessPoint) => {
            return accessPoint.ssid === connection;
          });
          if (accessPoint != null) {
            icon = getAccessPointIcon(accessPoint);
            label = `${connection}`;
            canConnect = network.wifi.activeAccessPoint.ssid !== connection;
          } else {
            icon = "󰤮 ";
            label = `${connection}`;
            canConnect = false;
          }

          return (
            <ButtonDropdown
              icon={icon}
              label={label}
              content={
                <box vertical={false} spacing={4} className="connections wifi">
                  {canConnect && (
                    <button
                      hexpand={true}
                      className="primaryButton"
                      label="Connect"
                      onClicked={() => {
                        execAsync(`nmcli c up ${connection}`)
                          .catch((error) => {
                            print(error);
                          })
                          .finally(() => {
                            updateConnections();
                          });
                      }}
                    />
                  )}
                  <button
                    hexpand={true}
                    className="primaryButton"
                    label="Forget"
                    onClicked={() => {
                      deleteConnection(connection);
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

function WifiScannedConnections() {
  const network = AstalNetwork.get_default();

  return (
    <box vertical={true}>
      {bind(network.wifi, "scanning").as((scanning) => {
        if (scanning) {
          return (
            <label
              className="wifi scanning"
              halign={Gtk.Align.START}
              label="Scanning…"
            />
          );
        } else {
          const accessPoints = network.wifi.accessPoints;

          const accessPointsUi = accessPoints
            .filter((value) => {
              return (
                value.ssid != null &&
                wifiConnections.get().find((connection) => {
                  return value.ssid === connection;
                }) == null
              );
            })
            .sort((a, b) => {
              if (a.strength > b.strength) {
                return -1;
              } else {
                return 1;
              }
            })
            .map((accessPoint) => {
              return (
                <ButtonDropdown
                  icon={getAccessPointIcon(accessPoint)}
                  label={`${accessPoint.ssid}`}
                  content={<PasswordEntry accessPoint={accessPoint} />}
                />
              );
            });

          return (
            <box vertical={true}>
              <label halign={Gtk.Align.START} label="Available networks" />
              {accessPointsUi}
            </box>
          );
        }
      })}
    </box>
  );
}

function VpnActiveConnections() {
  return (
    <box vertical={true}>
      {activeVpnConnections().as((connections) => {
        if (connections.length === 0) {
          return <box />;
        }
        return (
          <box vertical={true}>
            <label halign={Gtk.Align.START} label="Active VPN" />
            {connections.map((connection) => {
              return (
                <ButtonDropdown
                  icon="󰯄"
                  label={`${connection}`}
                  content={
                    <box
                      css={`
                        margin-top: 4px;
                      `}
                      vertical={true}
                      spacing={4}
                    >
                      <button
                        hexpand={true}
                        className="primaryButton"
                        label="Disconnect"
                        onClicked={() => {
                          execAsync(`nmcli c down ${connection}`)
                            .catch((error) => {
                              print(error);
                            })
                            .finally(() => {
                              updateConnections();
                            });
                        }}
                      />
                      <button
                        hexpand={true}
                        className="primaryButton"
                        label="Forget"
                        onClicked={() => {
                          deleteConnection(connection);
                        }}
                      />
                    </box>
                  }
                />
              );
            })}
          </box>
        );
      })}
    </box>
  );
}

function VpnConnections() {
  return (
    <box vertical={true}>
      {vpnConnections((connectionsValue) => {
        if (connectionsValue.length === 0) {
          return <box />;
        }

        return (
          <box vertical={true}>
            <label halign={Gtk.Align.START} label="VPN Connections" />
            {connectionsValue.map((connection) => {
              const isConnecting = Variable(false);

              return (
                <ButtonDropdown
                  icon="󰯄"
                  label={`${connection}`}
                  content={
                    <box
                      css={`
                        margin-top: 4px;
                      `}
                      vertical={true}
                      spacing={4}
                    >
                      <button
                        hexpand={true}
                        className="primaryButton"
                        label={isConnecting().as((connecting) => {
                          if (connecting) {
                            return "Connecting";
                          } else {
                            return "Connect";
                          }
                        })}
                        onClicked={() => {
                          if (!isConnecting.get()) {
                            isConnecting.set(true);
                            connectVpn(connection);
                          }
                        }}
                      />
                      <button
                        hexpand={true}
                        className="primaryButton"
                        label="Forget"
                        onClicked={() => {
                          deleteConnection(connection);
                        }}
                      />
                    </box>
                  }
                />
              );
            })}
          </box>
        );
      })}
    </box>
  );
}

export default function () {
  const network = AstalNetwork.get_default();

  updateConnections();

  const networkName = Variable.derive([
    getNetworkNameBinding(),
    activeVpnConnections,
  ]);

  return (
    <ArrowDropdown
      label={networkName().as((value) => {
        const networkNameValue = value[0];
        const activeVpnConnectionsValue = value[1];
        if (activeVpnConnectionsValue.length === 0) {
          return networkNameValue;
        } else {
          return `${networkNameValue} (+VPN)`;
        }
      })}
      icon={getNetworkIconBinding()}
      content={
        <box vertical={true} className="controls network">
          {network.wifi &&
            bind(network.wifi, "activeAccessPoint").as((activeAccessPoint) => {
              return (
                <button
                  className=""
                  css={`
                    margin-bottom: 12px;
                  `}
                  label="Forget"
                  onClicked={() => {
                    deleteConnection(activeAccessPoint.ssid);
                  }}
                />
              );
            })}
          <VpnActiveConnections />
          <VpnConnections />
          {network.wifi && <WifiConnections connections={wifiConnections} />}
          {network.wifi && <WifiScannedConnections />}
        </box>
      }
      onClicked={() => {
        network.wifi?.scan();
      }}
    />
  );
}
