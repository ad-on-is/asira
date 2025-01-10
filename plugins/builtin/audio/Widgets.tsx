import Wp from "gi://AstalWp";
import { bind, Variable } from "astal";
import { getVolumeIcon, truncateDescription, getMicrophoneIcon } from "./audio";
import { togglePopup } from "core/Popup";
import { MicrophoneControls, SpeakerControls } from "./Controls";
import { Astal } from "astal/gtk3";
import { Gdk } from "astal/gtk3";

function AudioButton(label: string, gdkmonitor?: Gdk.Monitor, opts?: any) {
  const device =
    label === "speaker"
      ? Wp.get_default()!.audio.default_speaker
      : Wp.get_default()!.audio.default_microphone;

  const listener = Variable.derive([
    bind(device, "description"),
    bind(device, "volume"),
    bind(device, "mute"),
  ]);

  const showDescription = opts?.textOnlyOn === undefined ||
    (opts?.textOnlyOn || []).includes(
      gdkmonitor?.model || "*",
    );

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
              : getMicrophoneIcon(device),
          )}
        />

        <label visible={showDescription}
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

export function VolumeButton({ gdkmonitor, opts }: { gdkmonitor?: Gdk.Monitor, opts?: any }) {
  return AudioButton("speaker", gdkmonitor, opts);
}
export function MicrophoneButton({ gdkmonitor, opts }: { gdkmonitor?: Gdk.Monitor, opts?: any }) {
  return AudioButton("microphone", gdkmonitor, opts);
}
