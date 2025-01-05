import GObject from "gi://GObject";
import Hyprland from "gi://AstalHyprland";
import { App, Astal, astalify, ConstructProps, Gtk, Gdk } from "astal/gtk3";
import { bind, GLib, Variable } from "astal";
import { OverviewWindowName } from "constants";
import NotificationHistory from "core/systemMenu/NotificationHistory";

class CalendarWidget extends astalify(Gtk.Calendar) {
  static {
    GObject.registerClass(this);
  }

  constructor(
    props: ConstructProps<CalendarWidget, Gtk.ColorButton.ConstructorProps, {}>,
  ) {
    super(props as any);
  }
}

export default function (anchor: Astal.WindowAnchor) {
  const time = Variable<GLib.DateTime>(GLib.DateTime.new_now_local()).poll(
    1000,
    () => GLib.DateTime.new_now_local(),
  );

  return (
    <window
      name={OverviewWindowName}
      application={App}
      anchor={anchor}
      layer={Astal.Layer.TOP}
      margin={5}
      visible={false}
      keymode={Astal.Keymode.ON_DEMAND}
      onKeyPressEvent={function (self, event: Gdk.Event) {
        if (event.get_keyval()[1] === Gdk.KEY_Escape) {
          self.hide();
        }
      }}
      setup={(self) => {
        bind(self, "hasToplevelFocus").subscribe((hasFocus) => {
          self.className = `window ${hasFocus ? "focused" : ""}`;
        });
      }}
    >
      <box vertical={false} className="overview">
        <box vertical={true} className="left">
          {/* <NotificationHistory /> */}
        </box>
        <box vertical={true} className="right">
          <label
            label={time().as((t) => {
              return t.format("%A")!;
            })}
          />
          <label
            label={time().as((t) => {
              return t.format("%B %-d, %Y")!;
            })}
          />
          <CalendarWidget
            className="calendar"
            css={`
              background-color: transparent;
            `}
          />
        </box>
      </box>
    </window>
  );
}
