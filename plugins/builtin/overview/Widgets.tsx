import GObject from "gi://GObject";
import Hyprland from "gi://AstalHyprland";
import { App, Astal, astalify, ConstructProps, Gtk, Gdk } from "astal/gtk3";
import { bind, GLib, Variable } from "astal";
import { OverviewWindowName } from "constants";
import { NotificationHistory } from "core/Notification";
import options from "options";
import { BigWeather } from "../weather/Widgets";
import Divider from "common/Divider";

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

export default function () {
  const time = Variable<GLib.DateTime>(GLib.DateTime.new_now_local()).poll(
    1000,
    () => GLib.DateTime.new_now_local(),
  );

  return (
    <box vertical={false} className="overview">
      <box
        vertical={true}
        className="left"
        css={`
          min-width: 400px;
          padding: 1rem;
        `}
      >
        <NotificationHistory />
      </box>
      <box
        vertical={true}
        className="right"
        css={`
          min-width: 300px;
          padding: 0.5rem;
        `}
      >
        <BigWeather />
        <box
          css={`
            min-height: 3rem;
          `}
        ></box>
        <label
          className="xxxlarge"
          label={time().as((t) => {
            return t.format("%H:%M")!;
          })}
        />
        <label
          className="large"
          label={time().as((t) => {
            return t.format("%B %-d, %Y")!;
          })}
        />

        <box
          css={`
            min-height: 3rem;
          `}
        ></box>
        <CalendarWidget className="calendar" />
        <box
          css={`
            min-height: 3rem;
          `}
        ></box>
      </box>
    </box>
  );
}
