import Wp from "gi://AstalWp";
import { bind, Variable } from "astal";
import { getMicrophoneIcon, getVolumeIcon, truncateDescription } from "./audio";
import { togglePopup } from "core/Popup";
import { MicrophoneControls, SpeakerControls } from "./Controls";
import { Astal } from "astal/gtk3";
import { Gdk } from "astal/gtk3";

function AudioButton(
  label: string,
  gdkmonitor?: Gdk.Monitor,
  opts?: { showDescription: boolean },
) {
  const device = label === "speaker"
    ? Wp.get_default()!.audio.default_speaker
    : Wp.get_default()!.audio.default_microphone;

  const listener = Variable.derive([
    bind(device, "description"),
    bind(device, "volume"),
    bind(device, "mute"),
  ]);

  return (
    <button
      className={`panelButton audio ${label}`}
      onClicked={() => {
        togglePopup(
          `${label}:audio`,
          Astal.WindowAnchor.TOP |
          Astal.WindowAnchor.RIGHT |
          Astal.WindowAnchor.BOTTOM,
          label === "speaker" ? <SpeakerControls /> : <MicrophoneControls />,
        );
      }}
    >
      <box>
        <label
          className="icon"
          label={listener(() =>
            label === "speaker"
              ? getVolumeIcon(device)
              : getMicrophoneIcon(device)
          )}
        />

        <label
          visible={opts?.showDescription || false}
          className="name"
          label={listener(() => `${truncateDescription(device.description)} `)}
        />

        <label
          className="value"
          label={listener(() => `${Math.round(device.volume * 100)}%`)}
        />
      </box>
    </button>
  );
}

export function VolumeButton(
  { gdkmonitor, opts }: {
    gdkmonitor?: Gdk.Monitor;
    opts?: { showDescription: boolean };
  },
) {
  return AudioButton("speaker", gdkmonitor, opts);
}
export function MicrophoneButton(
  { gdkmonitor, opts }: {
    gdkmonitor?: Gdk.Monitor;
    opts?: { showDescription: boolean };
  },
) {
  return AudioButton("microphone", gdkmonitor, opts);
}
