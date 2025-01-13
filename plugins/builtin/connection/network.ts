import AstalNetwork from "gi://AstalNetwork";
import { bind, Variable } from "astal";
import { execAsync } from "astal/process";

export const wifiConnections = Variable<string[]>([]);
export const activeWifiConnections = Variable<string[]>([]);
export const vpnConnections = Variable<string[]>([]);
export const activeVpnConnections = Variable<string[]>([]);

function ssidInRange(ssid: string) {
  const network = AstalNetwork.get_default();

  return (
    network.wifi.accessPoints.find((accessPoint) => {
      return accessPoint.ssid === ssid;
    }) != null
  );
}

export function updateConnections() {
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

export function deleteConnection(ssid: string) {
  execAsync(["bash", "-c", `nmcli connection delete "${ssid}"`]).finally(() => {
    updateConnections();
  });
}

export function connectVpn(name: string) {
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

export function getNetworkNameBinding() {
  const network = AstalNetwork.get_default();

  if (network.wifi != null) {
    const variable = Variable.derive([
      bind(network, "primary"),
      bind(network, "wifi"),
      bind(network.wifi, "ssid"),
    ]);

    return variable((value) => {
      const primary = value[0];
      const wifi = value[1];
      if (primary === AstalNetwork.Primary.WIFI) {
        return wifi.ssid;
      } else if (primary === AstalNetwork.Primary.WIRED) {
        return "Wired";
      } else if (network.wired !== null) {
        return "Wired";
      } else if (network.wifi !== null) {
        return network.wifi.ssid;
      } else {
        return "Not connected";
      }
    });
  } else {
    const variable = Variable.derive([
      bind(network, "primary"),
      bind(network, "wifi"),
    ]);

    return variable((value) => {
      const primary = value[0];
      const wifi = value[1];
      if (primary === AstalNetwork.Primary.WIFI) {
        return wifi.ssid;
      } else if (primary === AstalNetwork.Primary.WIRED) {
        return "Wired";
      } else if (network.wired !== null) {
        return "Wired";
      } else if (network.wifi !== null) {
        return network.wifi.ssid;
      } else {
        return "Not connected";
      }
    });
  }
}

export function getNetworkIconBinding() {
  const network = AstalNetwork.get_default();

  if (network.wifi !== null) {
    return Variable.derive([
      bind(network, "connectivity"),
      bind(network.wifi, "strength"),
      bind(network, "primary"),
    ])(() => getNetworkIcon(network));
  } else {
    return Variable.derive([
      bind(network, "connectivity"),
      bind(network, "primary"),
    ])(() => getNetworkIcon(network));
  }
}

export function getNetworkIcon(network: AstalNetwork.Network) {
  const { connectivity, wifi, wired } = network;
  // Handle wired connection

  // Handle Wi-Fi connection
  if (wifi !== null) {
    const { strength, internet, enabled } = wifi;

    // If Wi-Fi is disabled or there is no connectivity
    if (!enabled || connectivity === AstalNetwork.Connectivity.NONE) {
      return "󰤭";
    }

    // Based on Wi-Fi signal strength and internet status
    if (strength <= 25) {
      if (internet === AstalNetwork.Internet.DISCONNECTED) {
        return "󰤠";
      } else if (internet === AstalNetwork.Internet.CONNECTED) {
        return "󰤟";
      } else if (internet === AstalNetwork.Internet.CONNECTING) {
        return "󰤡";
      }
    } else if (strength <= 50) {
      if (internet === AstalNetwork.Internet.DISCONNECTED) {
        return "󰤣";
      } else if (internet === AstalNetwork.Internet.CONNECTED) {
        return "󰤢";
      } else if (internet === AstalNetwork.Internet.CONNECTING) {
        return "󰤤";
      }
    } else if (strength <= 75) {
      if (internet === AstalNetwork.Internet.DISCONNECTED) {
        return "󰤦";
      } else if (internet === AstalNetwork.Internet.CONNECTED) {
        return "󰤥";
      } else if (internet === AstalNetwork.Internet.CONNECTING) {
        return "󰤧";
      }
    } else {
      if (internet === AstalNetwork.Internet.DISCONNECTED) {
        return "󰤩";
      } else if (internet === AstalNetwork.Internet.CONNECTED) {
        return "󰤨";
      } else if (internet === AstalNetwork.Internet.CONNECTING) {
        return "󰤪";
      }
    }

    // Fallback if none of the conditions are met
    return "󰤯";
  } else {

    if (wired !== null) {
      if (wired.internet === AstalNetwork.Internet.CONNECTED) {
        return "󰈀";
      } else {
        return "󰈀"; // You could add more logic here for wired states if needed
      }
    }
  }

  // Default or unknown status
  return "󰤮";
}

export function getAccessPointIcon(accessPoint: AstalNetwork.AccessPoint) {
  const { strength, flags } = accessPoint;

  // Based on Wi-Fi signal strength and internet status
  if (strength <= 25) {
    if (flags === 0) {
      return "󰤟";
    } else {
      return "󰤡";
    }
  } else if (strength <= 50) {
    if (flags === 0) {
      return "󰤢";
    } else {
      return "󰤤";
    }
  } else if (strength <= 75) {
    if (flags === 0) {
      return "󰤥";
    } else {
      return "󰤧";
    }
  } else {
    if (flags === 0) {
      return "󰤨";
    } else {
      return "󰤪";
    }
  }
}

