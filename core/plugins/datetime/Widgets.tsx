import { bind, GLib, Variable } from "astal";

import { App, Gdk, Gtk } from "astal/gtk3";
import { MiniWeather } from "../weather/Widgets";
import { togglePopup } from "core/Popup";
import OverView from "../overview/Widgets";
import { Astal } from "astal/gtk3";
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
  const time = Variable<string>("").poll(
    1000,
    () => GLib.DateTime.new_now_local().format(opts?.timeFormat || "%H-%M:%S")!,
  );

  const date = Variable<string>("").poll(
    1000,
    () =>
      GLib.DateTime.new_now_local().format(opts?.dateFormat || "%a, %d.%b %Y")!,
  );

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
        <label className="date" label={date()} />
        <label label="" className="time icon" />
        <label className="time" label={time()} />

        {opts?.showWeather || true ? <MiniWeather /> : <box />}
      </box>
    </button>
  );
}
