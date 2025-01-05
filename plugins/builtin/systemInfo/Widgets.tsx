import { App, Astal } from "astal/gtk3";
import {
  MicrophoneControls,
  SpeakerControls,
} from "plugins/builtin/audio/Controls";
import { bind } from "astal";
import { Gtk, Gdk } from "astal/gtk3";
import PowerOptions from "../../../common/PowerOptions";
import NetworkControls from "plugins/builtin/connection/NetworkControls";
import BluetoothControls from "plugins/builtin/connection/BluetoothControls";
import Divider from "common/Divider";
import MediaPlayers from "core/MediaPlayers";

export default function () {
  let window: Gtk.Window;

  return (
    <box vertical={true} className="systemInfo">
      <box
        vertical={true}
        setup={(self) => {
          setTimeout(() => {
            bind(window, "hasToplevelFocus").subscribe((hasFocus) => {
              self.className = `system window ${hasFocus ? "focused" : ""}`;
            });
          }, 1_000);
        }}
      >
        <box
          css={`
            margin: 0 10px 0 10px;
          `}
          vertical={true}
        >
          <box css={"margin-top: 20px;"} />
          <PowerOptions />
          {/* <Divider css={"margin: 0 60px 0 60px;"} /> */}
          <NetworkControls />
          <BluetoothControls />
          <SpeakerControls />
          <MicrophoneControls />
          {/*Disabling Media players while this bug persists https://github.com/Aylur/astal/issues/226*/}
          {/* <MediaPlayers /> */}
          {/* <box css={"margin-top: 20px;"} /> */}
          {/* <box css={"margin-top: 20px;"} /> */}
          {/* <Divider css={"margin: 0 60px 0 60px;"} /> */}
          {/* <box css={"margin-top: 20px;"} /> */}
          {/* <box css={"margin-top: 20px;"} /> */}
        </box>
      </box>
      <box vexpand={true} />
    </box>
  );
}
