import { App, Astal, Gtk, Gdk } from "astal/gtk3";
import { Binding, GLib } from "astal";
import options from "init";

export default function OSD({
  gdkmonitor,
  trigger,
  name,
  widget,
}: {
  gdkmonitor?: Gdk.Monitor;
  trigger: Binding<any>;
  name: string;
  widget?: Gtk.Widget
}) {
  let windowVisibilityTimeout: GLib.Source | null = null;

  return (
    <window
      name={`${name}OSD`}
      application={App}
      gdkmonitor={gdkmonitor}
      anchor={options.osd.position}
      exclusivity={Astal.Exclusivity.NORMAL}
      layer={Astal.Layer.OVERLAY}
      className={`window osd ${name}`}
      margin_top={options.osd.margin[0]}
      margin_right={options.osd.margin[1]}
      margin_bottom={options.osd.margin[2]}
      margin_left={options.osd.margin[3]}
      visible={false}
      setup={(self) => {
        // prevent trigger on init
        let canShow = false;
        setTimeout(() => {
          canShow = true;
        }, 1_000);
        trigger.subscribe(() => {
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
          }, options.osd.stayOpenMs);
        });
      }}
    >
      {<box className="inner" hexpand={true}>{widget || <label label="!!!! - Missing Widget - !!!!" />}</box>}
    </window>
  );
}

export function IconWithTextAndSlider({ icon, title, value }: { icon: Binding<string>, title: Binding<string>, value: Binding<number> }) {
  return (<box vertical={false} className="osdIconWithTextAndSlider">
    <label className="icon" label={icon} halign={Gtk.Align.START} />
    <box vertical={true} valign={Gtk.Align.CENTER}>
      <label className="title" label={title} halign={Gtk.Align.START} />
      <slider className="slider" hexpand={true} value={value} sensitive={false} />
    </box>
  </box>
  )
}
