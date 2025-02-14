import GObject, { register, property } from "astal/gobject";
import { interval } from "astal";
import { execAsync } from "astal/process";
import { bytesToHumanReadable, Unit } from "core/utils/helpers";

const get = () => execAsync(`bash -c "df | jc --df"`);

@register({ GTypeName: "Storage" })
export default class Storage extends GObject.Object {
  static instance: Storage;
  static get_default() {
    if (!this.instance) this.instance = new Storage();

    return this.instance;
  }

  #info: UnitInfo[] = [];

  @property()
  get info() {
    return this.#info;
  }

  getInfo() {
    get().then((info) => {
      this.#info = (JSON.parse(info) as []).map(
        (d) =>
          ({
            name: d["mounted_on"],
            free: bytesToHumanReadable(d["available"]),
            used: bytesToHumanReadable(d["used"]),
            total: bytesToHumanReadable(d["available"] + d["used"]),
            freePercent: 100 - d["use_percent"],
            usedPercent: d["use_percent"],
          }) as UnitInfo,
      );
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

export type UnitInfo = {
  name: string;
  free: Unit;
  used: Unit;
  total: Unit;
  freePercent: number;
  usedPercent: number;
};
