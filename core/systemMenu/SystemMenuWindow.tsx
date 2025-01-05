import { App, Astal } from "astal/gtk3";
import {
  MicrophoneControls,
  SpeakerControls,
} from "plugins/builtin/audio/Controls";
import Wp from "gi://AstalWp";
import { bind } from "astal";
import { Gtk, Gdk } from "astal/gtk3";
import PowerOptions from "./PowerOptions";
import ThemeOptions from "./ThemeOptions";
import MediaPlayers from "./MediaPlayers";
import NotificationHistory from "./NotificationHistory";
import NetworkControls from "plugins/builtin/connection/NetworkControls";
import BluetoothControls from "plugins/builtin/connection/BluetoothControls";
import Divider from "common/Divider";

import { SystemMenuWindowName } from "constants";
export default function () {
  let window: Gtk.Window;

  return (
    <window
      exclusivity={Astal.Exclusivity.NORMAL}
      anchor={
        Astal.WindowAnchor.TOP |
        Astal.WindowAnchor.LEFT |
        Astal.WindowAnchor.BOTTOM
      }
      layer={Astal.Layer.TOP}
      css={`
        background: transparent;
      `}
      name={SystemMenuWindowName}
      application={App}
      margin={5}
      keymode={Astal.Keymode.ON_DEMAND}
      visible={false}
      onKeyPressEvent={function (self, event: Gdk.Event) {
        if (event.get_keyval()[1] === Gdk.KEY_Escape) {
          self.hide();
        }
      }}
      setup={(self) => {
        window = self;
      }}
    >
      <box vertical={true}>
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
            {/*<MediaPlayers/>*/}
            {/* <box css={"margin-top: 20px;"} /> */}
            {/* <box css={"margin-top: 20px;"} /> */}
            {/* <Divider css={"margin: 0 60px 0 60px;"} /> */}
            {/* <box css={"margin-top: 20px;"} /> */}
            {/* <box css={"margin-top: 20px;"} /> */}

            <NotificationHistory />
          </box>
        </box>
        <box vexpand={true} />
      </box>
    </window>
  );
}
