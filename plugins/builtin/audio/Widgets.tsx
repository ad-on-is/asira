import Wp from "gi://AstalWp";
import { bind, Variable } from "astal";
import { Astal, Gdk } from "astal/gtk3";
import { getVolumeIcon, truncateDescription, getMicrophoneIcon } from "./audio";
import options from "options";
import { togglePopup } from "core/Popup";
import { MicrophoneControls, SpeakerControls } from "./Controls";

function AudioButton(label: string, gdkmonitor?: Gdk.Monitor) {
  const device =
    label === "speaker"
      ? Wp.get_default()!.audio.default_speaker
      : Wp.get_default()!.audio.default_microphone;

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
        {showDescription ? (
          <box>
            <label
              className="name"
              label={listener(() => truncateDescription(device.description))}
            />
          </box>
        ) : (
          <></>
        )}
        <label
          className="value"
          label={listener(() => ` ${Math.round(device.volume * 100)}%`)}
        />
      </box>
    </button>
  );
}

export function VolumeButton({ gdkmonitor }: { gdkmonitor?: Gdk.Monitor }) {
  return AudioButton("speaker", gdkmonitor);
}
export function MicrophoneButton({ gdkmonitor }: { gdkmonitor?: Gdk.Monitor }) {
  return AudioButton("microphone", gdkmonitor);
}
