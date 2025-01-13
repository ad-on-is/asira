import Wp from "gi://AstalWp";
import { bind, Variable } from "astal";
import { getMicrophoneIcon, getVolumeIcon } from "./audio";
import OSD, { IconWithTextAndSlider } from "core/OSD";
import { Gdk, Gtk } from "astal/gtk3";

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
      gdkmonitor={gdkmonitor}
      trigger={bind(device, "volume")}
      name="volume"
      widget={<IconWithTextAndSlider icon={listener(() => iconFunc(device))} title={
        bind(device, "volume").as(
          (vol) => `Volume ${Math.round(vol * 100)}%`,
        )
      } value={bind(device, "volume")} />}
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
