import OSD from "core/OSD/OSD";
import Brightness from "./brightness";
import { getBrightnessIcon } from "./brightness";

import { bind, Variable } from "astal";

export function BrightnessOSD(monitor?: number) {
  const brightness = Brightness.get_default();

  return (
    <OSD
      iconLabel={bind(brightness, "screen").as(() => {
        return getBrightnessIcon(brightness);
      })}
      // monitor={monitor}
      label="Brightness"
      sliderValue={bind(brightness, "screen")}
      windowName="brightness"
    />
  );
}
