import { App, Astal, Gtk, Gdk } from "astal/gtk3";
import { Binding, GLib } from "astal";
import options from "options";

export default function OSD({
  gdkmonitor,
  iconLabel,
  label,
  sliderValue,
  windowName,
}: {
  gdkmonitor?: Gdk.Monitor;
  iconLabel: Binding<string>;
  label: Binding<string>;
  sliderValue: Binding<number>;
  windowName: string;
}) {
  let windowVisibilityTimeout: GLib.Source | null = null;

  return (
    <window
      name={`${windowName}OSD`}
      application={App}
      gdkmonitor={gdkmonitor}
      anchor={options.osd.position}
      exclusivity={Astal.Exclusivity.NORMAL}
      layer={Astal.Layer.OVERLAY}
      className="window osd"
      margin_top={options.osd.margin[0]}
      margin_right={options.osd.margin[1]}
      margin_bottom={options.osd.margin[2]}
      margin_left={options.osd.margin[3]}
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
      <box vertical={false} halign={Gtk.Align.CENTER} className="inner">
        <label className="icon" label={iconLabel} />
        <box vertical={true} valign={Gtk.Align.CENTER}>
          <label className="title" label={label} halign={Gtk.Align.START} />
          <slider className="slider" hexpand={true} value={sliderValue} />
        </box>
      </box>
    </window>
  );
}
