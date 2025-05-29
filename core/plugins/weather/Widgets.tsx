import Weather from "./weather";
import { bind } from "astal";
import { Gdk } from "astal/gtk3";
export function MiniWeather(
  { gdkmonitor, opts }: { gdkmonitor?: Gdk.Monitor; opts?: any },
) {
  const weather = Weather.get_default();
  return (
    <>
      <icon
        className="icon weather mini"
        icon={bind(weather, "info").as(
          (info) =>
            `/home/adonis/.local/share/ow-icons/images/${info.weather[0].icon
            }_t.png`,
        )}
      />
      <label
        className="value weather mini"
        label={bind(weather, "info").as(
          (info) => `${Math.round(info.main.temp)}°C`,
        )}
      />
    </>
  );
}

export function Forecast({ gdkmonitor, opts }: { gdkmonitor?: Gdk.Monitor, opts?: any }) {
  const weather = Weather.get_default();



  return (<box className="weather forecast">
    {bind(weather, "info").as((info) => info.forecast.list.map((f) => (
      <box vertical={true} widthRequest={70}>
        <icon
          className="icon"
          icon={bind(weather, "info").as(
            (info) =>
              `/home/adonis/.local/share/ow-icons/images/${f.weather[0].icon
              }_t.png`,
          )}
        />

        <label label={`${f.date.format("%a")}`} />
        <label label={`${Math.round(f.main.temp)}°C`} />

      </box>
    )))}
  </box>)
}

export function BigWeather(
  { gdkmonitor, opts }: { gdkmonitor?: Gdk.Monitor; opts?: any },
) {
  const weather = Weather.get_default();
  return (
    <box className="weather big" vertical={true}>
      <icon
        className="icon"
        icon={bind(weather, "info").as(
          (info) =>
            `/home/adonis/.local/share/ow-icons/images/${info.weather[0].icon
            }_t.png`,
        )}
      />
      <label
        className="large"
        label={bind(weather, "info").as(
          (info) => `${Math.round(info.main.temp)}°C`,
        )}
      />

      <label
        label={bind(weather, "info").as((info) => `${info.name}, ${info.city}`)}
      />
    </box>
  );
}
