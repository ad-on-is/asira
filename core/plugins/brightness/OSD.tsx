import OSD, { IconWithTextAndSlider } from "core/OSD";
import Brightness, { getBrightnessIcon } from "./brightness";

import { Gdk } from "astal/gtk3";

import { bind, Variable } from "astal";

export function BrightnessOSD(gdkmonitor?: Gdk.Monitor) {
  const brightness = Brightness.get_default();
  const listener = Variable.derive([bind(brightness, "screen")])

  return (
    <OSD
      gdkmonitor={gdkmonitor}
      trigger={bind(brightness, "screen")}
      name="brightness"
      widget={<IconWithTextAndSlider icon={listener(() => getBrightnessIcon(brightness))} title={
        bind(brightness, "screen").as(
          (b) => `Brigthtness ${Math.round(b * 100)}%`,
        )
      } value={bind(brightness, "screen")} />}

    />
  );
}
