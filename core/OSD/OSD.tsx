import { App, Astal, Gtk, Gdk } from "astal/gtk3";
import { Binding, GLib } from "astal";

export default function OSD({
  gdkmonitor,
  iconLabel,
  label,
  sliderValue,
  windowName,
}: {
  gdkmonitor?: Gdk.Monitor;
  iconLabel: Binding<string>;
  label: string;
  sliderValue: Binding<number>;
  windowName: string;
}) {
  let windowVisibilityTimeout: GLib.Source | null = null;

  return (
    <window
      name={`${windowName}OSD`}
      application={App}
      gdkmonitor={gdkmonitor}
      anchor={Astal.WindowAnchor.BOTTOM}
      exclusivity={Astal.Exclusivity.NORMAL}
      layer={Astal.Layer.OVERLAY}
      className="window"
      margin_bottom={100}
      visible={false}
      setup={(self) => {
        let canShow = false;
        setTimeout(() => {
          canShow = true;
        }, 3_000);
        sliderValue.subscribe(() => {
          if (!canShow) {
            return;
          }
          if (windowVisibilityTimeout != null) {
            windowVisibilityTimeout.destroy();
          }
          self.visible = true;
          windowVisibilityTimeout = setTimeout(() => {
            self.visible = false;
            windowVisibilityTimeout?.destroy();
            windowVisibilityTimeout = null;
          }, 1_000);
        });
      }}
    >
      <box
        vertical={false}
        halign={Gtk.Align.CENTER}
        css={"padding: 18px 5px;"}
      >
        <label
          css={"margin-right: 15px;"}
          className="alertIcon"
          label={iconLabel}
        />
        <box
          vertical={true}
          css={"margin-left: 10px;"}
          valign={Gtk.Align.CENTER}
        >
          <label
            className="labelSmall"
            label={label}
            halign={Gtk.Align.START}
          />
          <slider
            css="padding-top: 2px;"
            className="alertProgress"
            hexpand={true}
            value={sliderValue}
          />
        </box>
      </box>
    </window>
  );
}
