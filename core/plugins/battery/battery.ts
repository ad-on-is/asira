import Battery from "gi://AstalBattery";

import { execAsync } from "astal/process";

import { bind } from "astal";

export function getBatteryIcon(battery: Battery.Device) {
  const percent = battery.percentage;
  if (battery.state === Battery.State.CHARGING) {
    if (percent <= 0.1) {
      return "󰢜";
    } else if (percent <= 0.2) {
      return "󰂆";
    } else if (percent <= 0.3) {
      return "󰂇";
    } else if (percent <= 0.4) {
      return "󰂈";
    } else if (percent <= 0.5) {
      return "󰢝";
    } else if (percent <= 0.6) {
      return "󰂉";
    } else if (percent <= 0.7) {
      return "󰢞";
    } else if (percent <= 0.8) {
      return "󰂊";
    } else if (percent <= 0.9) {
      return "󰂋";
    } else {
      return "󰂅";
    }
  } else {
    if (percent <= 0.1) {
      return "󰁺";
    } else if (percent <= 0.2) {
      return "󰁻";
    } else if (percent <= 0.3) {
      return "󰁼";
    } else if (percent <= 0.4) {
      return "󰁽";
    } else if (percent <= 0.5) {
      return "󰁾";
    } else if (percent <= 0.6) {
      return "󰁿";
    } else if (percent <= 0.7) {
      return "󰂀";
    } else if (percent <= 0.8) {
      return "󰂁";
    } else if (percent <= 0.9) {
      return "󰂂";
    } else {
      return "󰁹";
    }
  }
}

export function ChargingAlertSound() {
  const battery = Battery.get_default();
  bind(battery, "charging").subscribe((charging) => {
    if (battery.batteryLevel === 1) {
      return;
    }
    if (charging) {
      execAsync(
        'bash -c "play $HOME/.config/hypr/assets/sounds/power-plug.ogg"',
      );
    } else {
      execAsync(
        'bash -c "play $HOME/.config/hypr/assets/sounds/power-unplug.ogg"',
      );
    }
  });
}

