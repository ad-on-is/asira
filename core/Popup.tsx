import { App, Astal, Gtk, Gdk } from "astal/gtk3";
import { Variable } from "astal";
import Wp from "gi://AstalWp";
import { bind, timeout } from "astal";

const openWindows = Variable([""]);

function toggle(name: string) {
  timeout(50, () => {
    App.toggle_window(name);
  });
}

export function togglePopup(
  identifier: string,
  anchor: Astal.WindowAnchor,
  child: Gtk.Widget,
) {
  const name = identifier;
  //TODO: handle close of other or similar popups
  //
  // let [name, category] = identifier.split(":");
  // if (typeof category === "undefined") {
  //   category = "empty";
  // }
  // console.log(name, category);
  if (!openWindows.get().includes(name)) {
    PopupWindow(name, anchor, child);
    const ow = openWindows.get();
    ow.push(name);
    openWindows.set(ow);
  } else {
    const ow = openWindows.get().filter((o) => o !== name);
    openWindows.set(ow);
  }
  toggle(name);
}

function PopupWindow(
  name: string,
  anchor: Astal.WindowAnchor,
  child: Gtk.Widget,
) {
  let window: Gtk.Window;
  return (
    <window
      exclusivity={Astal.Exclusivity.NORMAL}
      anchor={anchor}
      layer={Astal.Layer.TOP}
      css={`
        background: transparent;
      `}
      name={name}
      application={App}
      margin={5}
      keymode={Astal.Keymode.ON_DEMAND}
      visible={false}
      onKeyPressEvent={function (self, event: Gdk.Event) {
        if (event.get_keyval()[1] === Gdk.KEY_Escape) {
          const ow = openWindows.get().filter((o) => o !== name);
          openWindows.set(ow);
          self.hide();
        }
      }}
      setup={(self) => {
        window = self;
      }}
    >
      <box vertical={true}>
        <box vertical={true} className="window">
          <box
            css={`
              margin: 10px 10px 10px 10px;
              min-width: 300px;
            `}
            vertical={true}
          >
            {child}
          </box>
        </box>
        <box vexpand={true} />
      </box>
    </window>
  );
}
