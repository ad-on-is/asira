import OSD from "core/OSD/OSD";
import Brightness from "./brightness";
import { getBrightnessIcon } from "./brightness";

import { Gdk } from "astal/gtk3";

import { bind, Variable } from "astal";

export function BrightnessOSD(gdkmonitor?: Gdk.Monitor) {
  const brightness = Brightness.get_default();

  return (
    <OSD
      iconLabel={bind(brightness, "screen").as(() => {
        return getBrightnessIcon(brightness);
      })}
      gdkmonitor={gdkmonitor}
      label="Brightness"
      sliderValue={bind(brightness, "screen")}
      windowName="brightness"
    />
  );
}
