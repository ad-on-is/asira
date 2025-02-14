import { Time } from "astal";
import { timeout } from "astal";


export function bytesToHumanReadable(bytes: number): Unit {
  const units = ["KB", "MB", "GB", "TB"];
  let i = 0;
  let size = bytes;
  while (size > 1024) {
    size /= 1024;
    i++;
  }
  return { size: Math.round(size * 100) / 100, unit: units[i] };
}


export type Unit = {
  size: number;
  unit: string;
};


export const debounce = (n: number, fn: (...params: any[]) => any, immed: boolean = false) => {
  let timer: Time | undefined = undefined;
  return function (this: any, ...args: any[]) {
    if (timer === undefined && immed) {
      fn.apply(this, args);
    }
    timer?.cancel();
    timer = timeout(n, () => fn.apply(this, args));
    return timer;
  }
};

export function xdebounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number,
  immediate: boolean = true
): (...args: Parameters<T>) => void {
  let timeout: number | undefined = undefined;

  return function (...args: Parameters<T>): void {

    const later = function () {
      timeout = undefined;
      if (!immediate) {
        func.apply(context, args);
      }
    };

    const callNow = immediate && !timeout;

    if (timeout !== undefined) {
      window.clearTimeout(timeout);
    }

    timeout = window.setTimeout(later, wait);

    if (callNow) {
      func.apply(context, args);
    }
  };
}
