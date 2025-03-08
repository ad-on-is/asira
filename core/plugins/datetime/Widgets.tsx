import { bind, GLib, Variable } from "astal";

import { App, Gdk, Gtk } from "astal/gtk3";
import { MiniWeather } from "../weather/Widgets";
import { togglePopup } from "core/Popup";
import OverView from "../overview/Widgets";
import { Astal } from "astal/gtk3";

const dateTime = Variable<GLib.DateTime>(GLib.DateTime.new_now_local()).poll(
  1000,
  () =>
    GLib.DateTime.new_now_local(),
);


export default function DateTime(
  { gdkmonitor, opts }: {
    gdkmonitor?: Gdk.Monitor;
    opts?: {
      dateFormat: string;
      timeFormat: string;
      showWeather: boolean;
      overview: { position: Astal.WindowAnchor };
    };
  },
): Gtk.Widget {

  return (
    <button
      className="panelButton dateTime"
      onClicked={() => {
        togglePopup(
          "dateTime",
          opts?.overview.position || Astal.WindowAnchor.TOP,
          <OverView />,
        );
        // App.toggle_window(OverviewWindowName);
      }}
    >
      <box>
        <label label="󰸗" className="date icon" />
        <label className="date" label={bind(dateTime).as((time) => time.format(opts?.dateFormat || "%a, %d.%b %Y")!)} />
        <label label="" className="time icon" />
        <label className="time" label={bind(dateTime).as((time) => time.format(opts?.timeFormat || "%H-%M:%S")!)} />

        {opts?.showWeather || true ? <MiniWeather /> : <box />}
      </box>
    </button>
  );
}
