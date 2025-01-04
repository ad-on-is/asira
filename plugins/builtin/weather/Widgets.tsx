import Weather from "./weather";
import { bind, GLib, Variable } from "astal";
export function MiniWeather() {
  const weather = Weather.get_default();
  return (
    <box className="weather">
      <label label=" " />
      <icon
        className="icon"
        icon={bind(weather, "info").as(
          (info) =>
            `/home/adonis/.local/share/ow-icons/images/${info.weather[0].icon}_t.png`,
        )}
      />
      <label
        label={bind(weather, "info").as(
          (info) => `${Math.round(info.main.temp)}°C`,
        )}
      />
    </box>
  );
}
