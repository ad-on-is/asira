import { App, Astal, Gtk, Gdk } from "astal/gtk3";
import { Variable } from "astal";
import Wp from "gi://AstalWp";
import { bind, timeout } from "astal";

const openWindows = Variable([""]);

function toggle(name: string) {
  timeout(10, () => {
    App.toggle_window(name);
  });
}

export function togglePopup(
  identifier: string,
  anchor: Astal.WindowAnchor,
  child: Gtk.Widget,
) {
  let [_, category] = identifier.split(":");
  const name = identifier
  if (typeof category === "undefined") {
    category = "empty";
  }
  const catOpen = openWindows.get().find((o) => o.includes(category))
  if (catOpen && catOpen !== identifier) {
    try {
      const o = App.get_window(catOpen);
      o?.destroy();
      const ow = openWindows.get().filter((o) => o !== catOpen);
      openWindows.set(ow)

    } catch (_) { }

  }

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
        <box vertical={true} className="window popUp">
          <box className="inner"
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
