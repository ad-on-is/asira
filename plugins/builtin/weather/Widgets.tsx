import Weather from "./weather";
import { bind } from "astal";
import { Gdk } from "astal/gtk3";
export function MiniWeather({ gdkmonitor }: { gdkmonitor?: Gdk.Monitor }) {
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
