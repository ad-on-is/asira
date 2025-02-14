import GTop from "gi://GTop";

import GObject, { register, property } from "astal/gobject";
import { interval } from "astal";
import { execAsync, exec } from "astal/process";
import { bytesToHumanReadable, Unit } from "core/utils/helpers";

let last_used = 0;
let last_total = 0;
const cpu_avgs: number[] = [];

@register({ GTypeName: "Top" })
export default class Top extends GObject.Object {
  static instance: Top;
  static get_default() {
    if (!this.instance) this.instance = new Top();

    return this.instance;
  }

  #cpu: CPUInfo = {
    loadPercent: 0,
    temperature: 0,
  };

  #memory: MemoryInfo = {
    free: { size: 0, unit: "GB" },
    used: { size: 0, unit: "GB" },
    total: { size: 0, unit: "GB" },
    usedPercent: 0,
  };

  @property()
  get cpu() {
    return this.#cpu;
  }
  @property()
  get memory() {
    return this.#memory;
  }

  getMemory() {
    const mem = new GTop.glibtop_mem();
    GTop.glibtop_get_mem(mem);
    const available = mem.free + mem.cached;
    const used = mem.total - available;
    this.#memory.free = bytesToHumanReadable(available / 1024);
    this.#memory.used = bytesToHumanReadable(used / 1024);
    this.#memory.total = bytesToHumanReadable(mem.total / 1024);
    this.#memory.usedPercent = Math.round((100 / mem.total) * used * 100) / 100;
    this.notify("memory");
  }

  getCPU() {
    const cpu = new GTop.glibtop_cpu();
    GTop.glibtop_get_cpu(cpu);
    const used = cpu.user + cpu.sys + +cpu.nice + cpu.irq + cpu.softirq;
    const total = used + cpu.idle + cpu.iowait;
    const diff_used = used - last_used;
    const diff_total = total - last_total;
    let load = 0.0;
    if (diff_total > 0) {
      load = 100 * (diff_used / diff_total);
    } else {
      load = 0.0;
    }
    last_used = used;
    last_total = total;
    cpu_avgs.push(load);
    if (cpu_avgs.length > 50) {
      cpu_avgs.shift();
    }
    const avg_load =
      Math.round(
        (cpu_avgs.reduce((acc, cur) => acc + cur, 0) / cpu_avgs.length) * 100,
      ) / 100;

    const tmp = exec(
      "bash -c \" sensors | grep CPU: | xargs echo -n | cut -d' ' -f 2 | sed -e 's/+//' | sed -e 's/°C//'\"",
    );

    this.#cpu.loadPercent = avg_load;
    this.#cpu.temperature = parseFloat(tmp) || 0;
    this.notify("cpu");
  }

  getInfo() {
    this.getCPU();
    this.getMemory();
  }

  constructor() {
    super();
    this.getInfo();
    const timer = interval(1_000, () => {
      this.getInfo();
    });
  }
}

export type CPUInfo = {
  loadPercent: number;
  temperature: number;
};

export type MemoryInfo = {
  free: Unit;
  used: Unit;
  total: Unit;
  usedPercent: number;
};
