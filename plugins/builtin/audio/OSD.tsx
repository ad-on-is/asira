import Wp from "gi://AstalWp";
import { bind, Variable } from "astal";
import { getMicrophoneIcon, getVolumeIcon } from "./audio";
import OSD from "core/OSD/OSD";
import { Gdk } from "astal/gtk3";

export function VolumeOSD(gdkmonitor?: Gdk.Monitor) {
  const device = Wp.get_default()!.audio.default_speaker;

  const listener = Variable.derive([
    bind(device, "description"),
    bind(device, "volume"),
    bind(device, "mute"),
  ]);

  return (
    <OSD
      iconLabel={listener(() => getVolumeIcon(device))}
      label="Volume"
      gdkmonitor={gdkmonitor}
      sliderValue={bind(device, "volume")}
      windowName="volume"
    />
  );
}

export function MicrophoneOSD(gdkmonitor?: Gdk.Monitor) {
  const device = Wp.get_default()!.audio.default_microphone;

  const listener = Variable.derive([
    bind(device, "description"),
    bind(device, "volume"),
    bind(device, "mute"),
  ]);

  return (
    <OSD
      iconLabel={listener(() => getMicrophoneIcon(device))}
      label="Volume"
      gdkmonitor={gdkmonitor}
      sliderValue={bind(device, "volume")}
      windowName="volume"
    />
  );
}
