import { bind } from "astal";
import { Gtk, Gdk } from "astal/gtk3";
import PowerOptions from "../../../common/PowerOptions";
export default function ({ gdkmonitor, opts }: { gdkmonitor?: Gdk.Monitor, opts?: any }) {
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
          {/*Disabling Media players while this bug persists https://github.com/Aylur/astal/issues/226*/}
          {/* <MediaPlayers /> */}
        </box>
      </box>
    </box>
  );
}
