import GObject, { register, property } from "astal/gobject";
import { interval } from "astal";
import { execAsync, exec } from "astal/process";

const get = () =>
  execAsync(`python3 ${exec("pwd")}/plugins/builtin/razer/razer.py`);

@register({ GTypeName: "Razer" })
export default class Razer extends GObject.Object {
  static instance: Razer;
  static get_default() {
    if (!this.instance) this.instance = new Razer();

    return this.instance;
  }

  #info: RazerInfo = {
    name: "",
    battery: 0,
    charging: false,
    brightness: 0,
    dpi: 0,
  };

  @property()
  get info() {
    return this.#info;
  }

  getInfo() {
    get().then((info) => {
      const sp = info.split("\n");
      this.#info.name = sp[0].replaceAll("Razer ", "");
      this.#info.battery = parseInt(sp[1]);
      this.#info.charging = sp[2] === "True";
      this.#info.brightness = parseInt(sp[3]);
      this.#info.dpi = parseInt(sp[4]);
      this.notify("info");
    });
  }

  constructor() {
    super();
    this.getInfo();
    const timer = interval(3_000, () => {
      this.getInfo();
    });
  }
}

export type RazerInfo = {
  name: string;
  battery: number;
  charging: boolean;
  brightness: number;
  dpi: number;
};
