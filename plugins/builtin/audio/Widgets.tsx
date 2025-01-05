import Wp from "gi://AstalWp";
import { bind, Variable } from "astal";
import { Gdk } from "astal/gtk3";
import { getVolumeIcon, truncateDescription, getMicrophoneIcon } from "./audio";
import options from "options";

function AudioButton(
  device: Wp.Endpoint,
  gdkmonitor?: Gdk.Monitor,
  label?: string,
) {
  const listener = Variable.derive([
    bind(device, "description"),
    bind(device, "volume"),
    bind(device, "mute"),
  ]);

  const showDescription =
    options.audio.showDescriptionOnMonitors.includes(
      gdkmonitor?.model || "*",
    ) || options.audio.showDescriptionOnMonitors.includes("*");

  return (
    <button className={`panelButton audio ${label}`}>
      <box>
        <label className="icon" label={listener(() => getVolumeIcon(device))} />
        {showDescription ? (
          <box>
            <label
              className="description"
              label={listener(() => truncateDescription(device.description))}
            />
          </box>
        ) : (
          <></>
        )}
        <label
          className="volume"
          label={listener(() => ` ${Math.round(device.volume * 100)}%`)}
        />
      </box>
    </button>
  );
}

export function VolumeButton({ gdkmonitor }: { gdkmonitor?: Gdk.Monitor }) {
  return AudioButton(
    Wp.get_default()!.audio.default_speaker,
    gdkmonitor,
    "speaker",
  );
}
export function MicrophoneButton({ gdkmonitor }: { gdkmonitor?: Gdk.Monitor }) {
  return AudioButton(
    Wp.get_default()!.audio.default_microphone,
    gdkmonitor,
    "microphone",
  );
}
