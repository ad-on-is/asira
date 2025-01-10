import { Gdk } from "astal/gtk3";
import Top from "./gtop";

export default function ({ gdkmonitor, opts }: { gdkmonitor?: Gdk.Monitor, opts?: any }) {
  const top = Top.get_default();
  return (
    <button className="panelButton gtop">
      <box>
        <box
          className="cpu section"
          setup={(self) => {
            self.hook(top, "notify::memory", () => {
              let level = "ok";

              if (top.cpu.loadPercent > 50 && top.cpu.loadPercent < 80) {
                level = "medium";
              }
              if (top.cpu.loadPercent > 80 && top.cpu.loadPercent < 95) {
                level = "high";
              }
              if (top.cpu.loadPercent > 95) {
                level = "critical";
              }
              self.child = (
                <box>
                  <box className={`load ${level}`}>
                    <label className="icon" label="" />
                    <label
                      className="value"
                      label={`${Math.round(top.cpu.loadPercent)}%`}
                    />
                  </box>
                  <box className={`temp ${level}`}>
                    <label className="icon temp" label=" " />
                    <label
                      className="value"
                      label={`${top.cpu.temperature}°C`}
                    />
                  </box>
                </box>
              );
            });
          }}
        />

        <box
          className="memory section"
          setup={(self) => {
            self.hook(top, "notify::memory", () => {
              let level = "ok";

              if (top.memory.usedPercent > 50 && top.memory.usedPercent < 80) {
                level = "medium";
              }
              if (top.memory.usedPercent > 80 && top.memory.usedPercent < 95) {
                level = "high";
              }
              if (top.memory.usedPercent > 95) {
                level = "critical";
              }
              self.child = (
                <box className={`${level}`}>
                  <label className="icon" label="" />
                  <label
                    className="unit"
                    label={`${Math.round(top.memory.used.size)}${top.memory.used.unit}`}
                  />
                  <label
                    className="value"
                    label={` ${Math.round(top.memory.usedPercent)}%`}
                  />
                </box>
              );
            });
          }}
        />
      </box>
    </button>
  );
}
