export function bytesToHumanReadable(bytes: number): Unit {
  const units = ["KB", "MB", "GB", "TB"];
  let i = 0;
  let size = bytes;
  while (size > 1024) {
    size /= 1024;
    i++;
  }
  return { size: Math.round(size), unit: units[i] };
}

export type Unit = {
  size: number;
  unit: string;
};
