import { Gdk, Gtk } from "astal/gtk3";
import options from "options";
import Razer from "./razer";
import { togglePopup } from "core/Popup";

export default function ({ gdkmonitor }: { gdkmonitor?: Gdk.Monitor }) {
  const razer = Razer.get_default();
  return (
    <button
      className="panelButton razer"
      onClicked={() => {
        // TODO: add Popup (with image)
        //
        // togglePopup(
        //   "dateTime",
        //   options.storage.position,
        //   <PopUp info={storage.info} />,
        // );
      }}
    >
      <box
        setup={(self) => {
          self.hook(razer, "notify::info", () => {
            let level = "full";

            if (razer.info.battery < 70 && razer.info.battery > 25) {
              level = "medium";
            }
            if (razer.info.battery < 25 && razer.info.battery > 10) {
              level = "low";
            }
            if (razer.info.battery < 10) {
              level = "critical";
            }
            self.child = (
              <box
                className={`${level} ${razer.info.charging ? "charging" : ""}`}
              >
                <label
                  className="icon"
                  label={`󰍽${razer.info.charging ? " 󱐋" : ""}`}
                />
                <label className="name" label={razer.info.name} />
                <label className="value" label={` ${razer.info.battery}%`} />
              </box>
            );
          });
        }}
      ></box>
    </button>
  );
}
