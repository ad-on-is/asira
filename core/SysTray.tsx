import Tray from "gi://AstalTray";
import { bind } from "astal";

export default function () {
  const tray = Tray.get_default();
  return (
    <box className="sysTray">
      {bind(tray, "items").as((items) =>
        items.map((item) => (
          <menubutton
            tooltipMarkup={bind(item, "title")}
            className="panelButton"
            usePopover={false}
            actionGroup={bind(item, "action-group").as((ag) => [
              "dbusmenu",
              ag,
            ])}
            menuModel={bind(item, "menu-model")}
          >
            <icon gicon={bind(item, "gicon")} />
          </menubutton>
        )),
      )}
    </box>
  );
}
