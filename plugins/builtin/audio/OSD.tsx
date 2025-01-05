import Wp from "gi://AstalWp";
import { bind, Variable } from "astal";
import { getMicrophoneIcon, getVolumeIcon } from "./audio";
import OSD from "core/OSD";
import { Gdk } from "astal/gtk3";

function AudioOSD(
  device: Wp.Endpoint,
  iconFunc: Function,
  gdkmonitor?: Gdk.Monitor,
) {
  const listener = Variable.derive([
    bind(device, "description"),
    bind(device, "volume"),
    bind(device, "mute"),
  ]);

  return (
    <OSD
      iconLabel={listener(() => iconFunc(device))}
      label={bind(device, "volume").as(
        (vol) => `Volume ${Math.round(vol * 100)}%`,
      )}
      gdkmonitor={gdkmonitor}
      sliderValue={bind(device, "volume")}
      windowName="volume"
    />
  );
}

export function VolumeOSD(gdkmonitor?: Gdk.Monitor) {
  return AudioOSD(
    Wp.get_default()!.audio.default_speaker,
    getVolumeIcon,
    gdkmonitor,
  );
}
export function MicrophoneOSD(gdkmonitor?: Gdk.Monitor) {
  return AudioOSD(
    Wp.get_default()!.audio.default_microphone,
    getMicrophoneIcon,
    gdkmonitor,
  );
}
