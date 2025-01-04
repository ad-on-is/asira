import Wp from "gi://AstalWp";
import { bind, Variable } from "astal";
import { getVolumeIcon } from "./audio";
import OSD from "core/OSD/OSD";

export function VolumeOSD(monitor?: number) {
  const defaultSpeaker = Wp.get_default()!.audio.default_speaker;

  const speakerVar = Variable.derive([
    bind(defaultSpeaker, "description"),
    bind(defaultSpeaker, "volume"),
    bind(defaultSpeaker, "mute"),
  ]);

  return (
    <OSD
      iconLabel={speakerVar(() => getVolumeIcon(defaultSpeaker))}
      label="Volume"
      // monitor={monitor}
      sliderValue={bind(defaultSpeaker, "volume")}
      windowName="volume"
    />
  );
}
