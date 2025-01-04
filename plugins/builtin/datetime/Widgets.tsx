import { bind, GLib, Variable } from "astal";

import Hyprland from "gi://AstalHyprland";
import { App } from "astal/gtk3";
import { CalendarWindowName } from "constants";
import { MiniWeather } from "../weather/Widgets";

export default function DateTime({
  showWeather = true,
}: {
  showWeather?: boolean;
}) {
  const time = Variable<string>("").poll(
    1000,
    () => GLib.DateTime.new_now_local().format("%H:%M:%S")!,
  );

  const date = Variable<string>("").poll(
    1000,
    () => GLib.DateTime.new_now_local().format("%a, %d.%b %Y")!,
  );

  return (
    <button
      className="panelButton dateTime"
      onClicked={() => {
        App.toggle_window(CalendarWindowName);
      }}
    >
      <box>
        <label label="󰸗 " className="date icon" />
        <label className="date" label={date()} />
        <label label="  " className="time icon" />
        <label className="time" label={time()} />

        {showWeather ? <MiniWeather /> : <></>}
      </box>
    </button>
  );
}
