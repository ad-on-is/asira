import { bind, GLib, Variable } from "astal";

import Hyprland from "gi://AstalHyprland";
import { App, Gdk } from "astal/gtk3";
import { OverviewWindowName } from "constants";
import { MiniWeather } from "../weather/Widgets";
import options from "init";
import { togglePopup } from "core/Popup";
import OverView from "../overview/Widgets";
export default function DateTime({ gdkmonitor }: { gdkmonitor?: Gdk.Monitor }) {
  const time = Variable<string>("").poll(
    1000,
    () => GLib.DateTime.new_now_local().format(options.dateTime.timeFormat)!,
  );

  const date = Variable<string>("").poll(
    1000,
    () => GLib.DateTime.new_now_local().format(options.dateTime.dateFormat)!,
  );

  return (
    <button
      className="panelButton dateTime"
      onClicked={() => {
        togglePopup("dateTime", options.overview.position, <OverView />);
        // App.toggle_window(OverviewWindowName);
      }}
    >
      <box>
        <label label="󰸗" className="date icon" />
        <label className="date" label={date()} />
        <label label="" className="time icon" />
        <label className="time" label={time()} />

        {options.dateTime.showWeather ? <MiniWeather /> : <></>}
      </box>
    </button>
  );
}
