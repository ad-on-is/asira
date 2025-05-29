import GObject, { register, property } from "astal/gobject";
import { interval } from "astal";
import { execAsync, exec } from "astal/process";
import options from "init"
import _ from "lodash"
import { GLib } from "astal";


const get = () => execAsync(`bash -c "${exec("pwd")}/core/plugins/weather/openweather.sh ${options.openweatherApiKey}"`);

@register({ GTypeName: "Weather" })
export default class Weather extends GObject.Object {
  static instance: Weather;
  static get_default() {
    if (!this.instance) this.instance = new Weather();
    return this.instance;
  }

  #info: WeatherInfo = {
    city: "Unknown",
    name: "Unknown",
    dt_date: "",
    dt: 0,
    date: GLib.DateTime.new_now_local(),
    dt_txt: "",
    forecast: { list: [] },
    weather: [{ icon: "01d" }],
    main: { temp: 0 },
  };

  @property()
  get info() {
    return this.#info;
  }

  getInfo() {
    get().then((info) => {
      this.#info = JSON.parse(info);
      let forecast = _.uniqBy(this.#info.forecast.list.map((f) => ({ ...f, dt_date: f.dt_txt.split(" ")[0], date: GLib.DateTime.new_from_unix_utc(f.dt) })), "dt_date")
      forecast = forecast.slice(1, forecast.length)
      this.#info.forecast.list = forecast

      this.notify("info");
    });
  }

  constructor() {
    super();
    this.getInfo();
    const timer = interval(300_000, () => {
      this.getInfo();
    });
  }
}

type WeatherInfo = {
  city: string;
  name: string;
  dt: number;
  date: GLib.DateTime;
  dt_txt: string;
  dt_date: string;
  forecast: {
    list: WeatherInfo[]
  };
  weather: { icon: string }[];
  main: { temp: number };
};
