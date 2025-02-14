import { Gdk, Gtk } from "astal/gtk3";
import Storage, { UnitInfo } from "./storage";
import { togglePopup } from "core/Popup";
import { Astal } from "astal/gtk3";

export default function (
  { gdkmonitor, opts }: { gdkmonitor?: Gdk.Monitor; opts?: any },
) {
  const storage = Storage.get_default();
  return (
    <button
      className="panelButton storage"
      onClicked={() => {
        togglePopup(
          "dateTime",
          opts.position || Astal.WindowAnchor.BOTTOM | Astal.WindowAnchor.RIGHT,
          <PopUp info={storage.info} />,
        );
      }}
    >
      <box
        setup={(self) => {
          const itemsToShow = opts.paths || [];
          self.hook(storage, "notify::info", () => {
            self.children = itemsToShow.map(
              (s: { name: string; label: string; isNetwork: boolean }) => {
                let i = storage.info.find((i) => i.name == s.name);

                if (!i) {
                  return <label label={`Invalid: ${s.name}`} />;
                }
                const isNetwork = s.isNetwork || false;
                const icon = isNetwork ? "󰒍" : "";
                return (
                  <box className={`section ${isNetwork ? "network" : ""} `}>
                    <label className="icon" label={icon} />
                    <label className="name" label={s.label} />
                    <label className="value" label={` ${i.freePercent}%`} />
                  </box>
                );
              },
            );
          });
        }}
      >
      </box>
    </button>
  );
}

function PopUp({ info }: { info: UnitInfo[] }) {
  return (
    <box vertical={true} className="storagePopup">
      {info.map((i) => {
        const val = (100 - i.freePercent) / 100;
        return val < 0.01 ? <box /> : (
          <box vertical={true} className="unit">
            <label label={i.name} halign={Gtk.Align.START} />
            <slider className="slider" value={val} sensitive={false} />
            <box>
              <label
                className="description"
                label={`Used ${i.used.size}${i.used.unit} of ${i.free.size + i.used.size
                  }${i.free.unit}`}
              />
            </box>
          </box>
        );
      })}
    </box>
  );
}
