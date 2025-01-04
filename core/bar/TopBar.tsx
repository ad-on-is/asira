import { App, Astal, Gtk, Gdk } from "astal/gtk3";

import options from "options";

export default function (gdkmonitor: Gdk.Monitor) {
  const widgets = options.topBar;

  return (
    <window
      css={`
        background: transparent;
      `}
      gdkmonitor={gdkmonitor}
      exclusivity={Astal.Exclusivity.EXCLUSIVE}
      margin={10}
      anchor={
        Astal.WindowAnchor.TOP |
        Astal.WindowAnchor.LEFT |
        Astal.WindowAnchor.RIGHT
      }
      application={App}
    >
      <centerbox
        className="window"
        css={`
          padding: 2px;
          min-height: 20px;
        `}
      >
        <box halign={Gtk.Align.START}>
          {widgets.left.map((Component) => (
            <Component />
          ))}
        </box>
        <box>
          {widgets.center.map((Component) => (
            <Component />
          ))}
        </box>
        <box halign={Gtk.Align.END}>
          {widgets.right.map((Component) => (
            <Component />
          ))}
        </box>
      </centerbox>
    </window>
  );
}
