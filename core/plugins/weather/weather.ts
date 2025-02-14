import GObject, { register, property } from "astal/gobject";
import { interval } from "astal";
import { execAsync, exec } from "astal/process";
import options from "init"



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
  weather: { icon: string }[];
  main: { temp: number };
};
