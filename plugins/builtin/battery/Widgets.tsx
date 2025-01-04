import { bind, Variable, GLib } from "astal";

import { execAsync } from "astal/process";
// import { isRecording } from "../screenshot/Screenshot";

import { getBatteryIcon } from "./battery";

import Battery from "gi://AstalBattery";
export function ScreenRecordingButton() {
  return (
    <button
      className="warningIconButton"
      label=""
      // visible={isRecording()}
      visible={false}
      onClicked={() => {
        execAsync("pkill wf-recorder");
      }}
    />
  );
}

export function BatteryButton() {
  const battery = Battery.get_default();

  let batteryWarningInterval: GLib.Source | null = null;

  function warningSound() {
    execAsync(
      'bash -c "play $HOME/.config/hypr/assets/sounds/battery-low.ogg"',
    );
  }

  const batteryVar = Variable.derive([
    bind(battery, "percentage"),
    bind(battery, "state"),
  ]);

  return (
    <label
      className={batteryVar((value) => {
        if (value[0] > 0.04 || battery.state === Battery.State.CHARGING) {
          if (batteryWarningInterval != null) {
            batteryWarningInterval.destroy();
            batteryWarningInterval = null;
          }
          return "panelButton";
        } else {
          if (batteryWarningInterval === null && battery.isBattery) {
            batteryWarningInterval = setInterval(() => {
              warningSound();
            }, 120_000);
            warningSound();
          }
          return "warningIconButton";
        }
      })}
      label={batteryVar(() => getBatteryIcon(battery))}
      visible={bind(battery, "isBattery")}
    />
  );
}
