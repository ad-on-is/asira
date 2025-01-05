import AstalNetwork from "gi://AstalNetwork";
import {
  getAccessPointIcon,
  getNetworkIconBinding,
  getNetworkNameBinding,
} from "./network";
import { bind, Variable } from "astal";
import { Gtk, App } from "astal/gtk3";
import { execAsync } from "astal/process";
import { DropDownArrowButton } from "core/Button";

const wifiConnections = Variable<string[]>([]);
const activeWifiConnections = Variable<string[]>([]);
const vpnConnections = Variable<string[]>([]);
export const activeVpnConnections = Variable<string[]>([]);

function ssidInRange(ssid: string) {
  const network = AstalNetwork.get_default();

  return (
    network.wifi.accessPoints.find((accessPoint) => {
      return accessPoint.ssid === ssid;
    }) != null
  );
}

function updateConnections() {
  // update active connections
  execAsync(["bash", "-c", `nmcli -t -f NAME,TYPE connection show --active`])
    .catch((error) => {
      print(error);
    })
    .then((value) => {
      if (typeof value !== "string") {
        return;
      }

      const wifiNames = value
        .split("\n")
        .filter((line) => line.includes("802-11-wireless"))
        .map((line) => line.split(":")[0].trim())
        .sort((a, b) => {
          const aInRange = ssidInRange(a);
          const bInRange = ssidInRange(b);
          if (aInRange && bInRange) {
            return 0;
          } else if (aInRange) {
            return -1;
          } else {
            return 1;
          }
        });

      activeWifiConnections.set(wifiNames);

      const vpnNames = value
        .split("\n")
        .filter((line) => line.includes("vpn"))
        .map((line) => line.split(":")[0].trim())
        .sort((a, b) => {
          if (a > b) {
            return 1;
          } else {
            return -1;
          }
        });

      activeVpnConnections.set(vpnNames);
    })
    .finally(() => {
      // update inactive connections
      execAsync(["bash", "-c", `nmcli -t -f NAME,TYPE connection show`])
        .catch((error) => {
          print(error);
        })
        .then((value) => {
          if (typeof value !== "string") {
            return;
          }

          const wifiNames = value
            .split("\n")
            .filter((line) => line.includes("802-11-wireless"))
            .map((line) => line.split(":")[0].trim())
            .filter((line) => !activeWifiConnections.get().includes(line))
            .sort((a, b) => {
              const aInRange = ssidInRange(a);
              const bInRange = ssidInRange(b);
              if (aInRange && bInRange) {
                return 0;
              } else if (aInRange) {
                return -1;
              } else {
                return 1;
              }
            });

          wifiConnections.set(wifiNames);

          const vpnNames = value
            .split("\n")
            .filter((line) => line.includes("vpn"))
            .map((line) => line.split(":")[0].trim())
            .filter((line) => !activeVpnConnections.get().includes(line))
            .sort((a, b) => {
              if (a > b) {
                return 1;
              } else {
                return -1;
              }
            });

          vpnConnections.set(vpnNames);
        });
    });
}

function deleteConnection(ssid: string) {
  execAsync(["bash", "-c", `nmcli connection delete "${ssid}"`]).finally(() => {
    updateConnections();
  });
}

function connectVpn(name: string) {
  // first disconnect any existing vpn connections
  activeVpnConnections.get().forEach((vpnName) => {
    execAsync(["bash", "-c", `nmcli connection down "${vpnName}"`]).finally(
      () => {
        updateConnections();
      },
    );
  });

  execAsync(["bash", "-c", `nmcli connection up "${name}"`])
    .catch((error) => {
      print(error);
    })
    .finally(() => {
      updateConnections();
    });
}

function PasswordEntry({
  accessPoint,
  passwordEntryRevealed,
}: {
  accessPoint: AstalNetwork.AccessPoint;
  passwordEntryRevealed: Variable<boolean>;
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
        passwordEntryRevealed.set(false);
        updateConnections();
      });
  };

  return (
    <box
      css={`
        margin-top: 4px;
      `}
      vertical={true}
      spacing={4}
    >
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
          const buttonsRevealed = Variable(false);

          setTimeout(() => {
            bind(App.get_window("systemInfo")!, "visible").subscribe(
              (visible) => {
                if (!visible) {
                  buttonsRevealed.set(false);
                }
              },
            );
          }, 1_000);

          let label: string;
          let canConnect: boolean;
          const accessPoint = network.wifi.accessPoints.find((accessPoint) => {
            return accessPoint.ssid === connection;
          });
          if (accessPoint != null) {
            label = `${getAccessPointIcon(accessPoint)}  ${connection}`;
            canConnect = network.wifi.activeAccessPoint.ssid !== connection;
          } else {
            label = `󰤮  ${connection}`;
            canConnect = false;
          }

          return (
            <box vertical={true}>
              <button
                hexpand={true}
                className="panelButton"
                onClicked={() => {
                  buttonsRevealed.set(!buttonsRevealed.get());
                }}
              >
                <label halign={Gtk.Align.START} label={label} />
              </button>
              <revealer
                revealChild={buttonsRevealed()}
                transitionDuration={200}
                transitionType={Gtk.RevealerTransitionType.SLIDE_DOWN}
              >
                <box
                  css={`
                    margin-top: 4px;
                  `}
                  vertical={true}
                  spacing={4}
                >
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
              </revealer>
            </box>
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
              halign={Gtk.Align.START}
              css={`
                margin-bottom: 4px;
              `}
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
              const passwordEntryRevealed = Variable(false);

              setTimeout(() => {
                bind(App.get_window("systemInfo")!, "visible").subscribe(
                  (visible) => {
                    if (!visible) {
                      passwordEntryRevealed.set(false);
                    }
                  },
                );
              }, 1_000);

              return (
                <box vertical={true}>
                  <box vertical={false}>
                    <button
                      hexpand={true}
                      className="panelButton"
                      onClicked={() => {
                        passwordEntryRevealed.set(!passwordEntryRevealed.get());
                      }}
                    >
                      <label
                        halign={Gtk.Align.START}
                        label={`${getAccessPointIcon(accessPoint)}  ${accessPoint.ssid}`}
                      />
                    </button>
                  </box>
                  <revealer
                    revealChild={passwordEntryRevealed()}
                    transitionDuration={200}
                    transitionType={Gtk.RevealerTransitionType.SLIDE_DOWN}
                  >
                    <PasswordEntry
                      accessPoint={accessPoint}
                      passwordEntryRevealed={passwordEntryRevealed}
                    />
                  </revealer>
                </box>
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
              const buttonsRevealed = Variable(false);

              setTimeout(() => {
                bind(App.get_window("systemInfo")!, "visible").subscribe(
                  (visible) => {
                    if (!visible) {
                      buttonsRevealed.set(false);
                    }
                  },
                );
              }, 1_000);

              return (
                <box vertical={true}>
                  <button
                    hexpand={true}
                    className="panelButton"
                    onClicked={() => {
                      buttonsRevealed.set(!buttonsRevealed.get());
                    }}
                  >
                    <label
                      halign={Gtk.Align.START}
                      label={`󰯄  ${connection}`}
                    />
                  </button>
                  <revealer
                    revealChild={buttonsRevealed()}
                    transitionDuration={200}
                    transitionType={Gtk.RevealerTransitionType.SLIDE_DOWN}
                  >
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
                  </revealer>
                </box>
              );
            })}
            <box
              css={`
                margin-top: 12px;
              `}
            />
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
              const buttonsRevealed = Variable(false);
              const isConnecting = Variable(false);

              setTimeout(() => {
                bind(App.get_window("systemInfo")!, "visible").subscribe(
                  (visible) => {
                    if (!visible) {
                      buttonsRevealed.set(false);
                    }
                  },
                );
              }, 1_000);

              return (
                <box vertical={true}>
                  <button
                    hexpand={true}
                    className="panelButton"
                    onClicked={() => {
                      buttonsRevealed.set(!buttonsRevealed.get());
                    }}
                  >
                    <label
                      halign={Gtk.Align.START}
                      label={`󰯄  ${connection}`}
                    />
                  </button>
                  <revealer
                    revealChild={buttonsRevealed()}
                    transitionDuration={200}
                    transitionType={Gtk.RevealerTransitionType.SLIDE_DOWN}
                  >
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
                  </revealer>
                </box>
              );
            })}
            <box
              css={`
                margin-top: 12px;
              `}
            />
          </box>
        );
      })}
    </box>
  );
}

export default function () {
  const network = AstalNetwork.get_default();
  const networkChooserRevealed = Variable(false);

  updateConnections();

  setTimeout(() => {
    bind(App.get_window("systemInfo")!, "visible").subscribe((visible) => {
      if (!visible) {
        networkChooserRevealed.set(false);
      } else {
        updateConnections();
      }
    });
  }, 1_000);

  const networkName = Variable.derive([
    getNetworkNameBinding(),
    activeVpnConnections,
  ]);

  return (
    <box vertical={true}>
      <box vertical={false} className="controls network">
        <label className="icon" label={getNetworkIconBinding()} />
        <label
          halign={Gtk.Align.START}
          hexpand={true}
          truncate={true}
          className="name"
          label={networkName().as((value) => {
            const networkNameValue = value[0];
            const activeVpnConnectionsValue = value[1];
            if (activeVpnConnectionsValue.length === 0) {
              return networkNameValue;
            } else {
              return `${networkNameValue} (+VPN)`;
            }
          })}
        />

        <DropDownArrowButton
          onClick={() => {
            networkChooserRevealed.set(!networkChooserRevealed.get());
            if (networkChooserRevealed.get()) {
              network.wifi?.scan();
            }
          }}
        />
      </box>
      <revealer
        className="networks"
        revealChild={networkChooserRevealed()}
        transitionDuration={200}
        transitionType={Gtk.RevealerTransitionType.SLIDE_DOWN}
      >
        <box vertical={true}>
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
          <box
            css={`
              margin-top: 12px;
            `}
          />
          {network.wifi && <WifiScannedConnections />}
        </box>
      </revealer>
    </box>
  );
}
