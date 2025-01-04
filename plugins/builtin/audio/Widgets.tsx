import Wp from "gi://AstalWp";
import { bind, Variable } from "astal";
import { getVolumeIcon, truncateDescription, getMicrophoneIcon } from "./audio";

export function VolumeButton({
  showDescription = true,
}: {
  showDescription?: boolean;
}) {
  const defaultSpeaker = Wp.get_default()!.audio.default_speaker;

  const speakerVar = Variable.derive([
    bind(defaultSpeaker, "description"),
    bind(defaultSpeaker, "volume"),
    bind(defaultSpeaker, "mute"),
  ]);

  return (
    <box className="panelButton">
      <label
        className="icon"
        label={speakerVar(() => getVolumeIcon(defaultSpeaker))}
      />
      {showDescription ? (
        <box>
          <label label=" " />
          <label
            label={speakerVar(() =>
              truncateDescription(defaultSpeaker.description),
            )}
          />
        </box>
      ) : (
        <></>
      )}
      <label label=" " />
      <label
        label={speakerVar(() => `${Math.round(defaultSpeaker.volume * 100)}%`)}
      />
    </box>
  );
}

export function MicrophoneButton({
  showDescription = true,
}: {
  showDescription?: boolean;
}) {
  const { defaultMicrophone } = Wp.get_default()!.audio;

  const micVar = Variable.derive([
    bind(defaultMicrophone, "description"),
    bind(defaultMicrophone, "volume"),
    bind(defaultMicrophone, "mute"),
  ]);

  return (
    <box className="panelButton">
      <label
        className="icon"
        label={micVar(() => getMicrophoneIcon(defaultMicrophone))}
      />

      {showDescription ? (
        <box>
          <label label=" " />
          <label
            label={micVar(() =>
              truncateDescription(defaultMicrophone.description),
            )}
          />
        </box>
      ) : (
        <></>
      )}

      <label label=" " />
      <label
        label={micVar(() => `${Math.round(defaultMicrophone.volume * 100)}%`)}
      />
    </box>
  );
}
