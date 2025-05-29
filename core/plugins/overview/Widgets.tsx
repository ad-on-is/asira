import GObject from "gi://GObject";
import { astalify, ConstructProps, Gtk, Gdk } from "astal/gtk3";
import { GLib, Variable } from "astal";
import { NotificationHistory } from "core/Notification";
import { BigWeather, Forecast } from "../weather/Widgets";
import Divider from "common/Divider";

const dateTime = Variable<GLib.DateTime>(GLib.DateTime.new_now_local()).poll(
  1000,
  () => GLib.DateTime.new_now_local(),
);


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

function BigDateTime() {
  return (<><box
    css={`
            min-height: 3rem;
          `}
  ></box>
    <label
      className="xxxlarge"
      label={dateTime().as((t) => {
        return t.format("%H:%M")!;
      })}
    />
    <label
      className="large"
      label={dateTime().as((t) => {
        return t.format("%a, %-d. %B %Y")!;
      })}
    /></>)


}

export default function ({ gdkmonitor, opts }: { gdkmonitor?: Gdk.Monitor, opts?: any }) {

  return (
    <box vertical={false} className="overview">
      <box
        vertical={true}
        className="left"
        css={`
          min-width: 400px;
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
        <BigDateTime />
        <box
          css={`
            min-height: 2rem;
          `}
        ></box>

        <BigWeather />
        <box
          css={`
            min-height: 1rem;
          `}
        ></box>

        <Forecast />

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
