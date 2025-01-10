import { App, Astal, Gtk, Gdk } from "astal/gtk3";

import options from "init";

function HorizontalBar(
  gdkmonitor: Gdk.Monitor,
  key: "topBar" | "bottomBar" | "leftBar" | "rightBar",
  anchor: Astal.WindowAnchor,
  vertical: boolean,
) {
  const opts = options[key];

  return (
    <window
      css={`
        background: transparent;
      `}
      className={`window bar ${key}`}
      gdkmonitor={gdkmonitor}
      exclusivity={Astal.Exclusivity.EXCLUSIVE}
      marginTop={opts.margin[0]}
      marginRight={opts.margin[1]}
      marginBottom={opts.margin[2]}
      marginLeft={opts.margin[3]}
      anchor={anchor}
      application={App}
    >
      <centerbox
        className={`window bar ${key}`}
        vertical={vertical}
        css={`
          padding: 2px;
          ${vertical ? "min-height: 20px" : "min-width: 40px"};
        `}
      >
        <box halign={Gtk.Align.START} vertical={vertical} className="col start">
          {opts.widgets.start.map((Component) => (
            <Component gdkmonitor={gdkmonitor} />
          ))}
        </box>
        <box vertical={vertical} className="col center">
          {opts.widgets.center.map((Component) => (
            <Component gdkmonitor={gdkmonitor} />
          ))}
        </box>
        <box
          className="col end"
          halign={Gtk.Align.END}
          vertical={vertical}
          valign={Gtk.Align.START}
        >
          {opts.widgets.end.map((Component) => (
            <Component gdkmonitor={gdkmonitor} />
          ))}
        </box>
      </centerbox>
    </window>
  );
}

export function TopBar(gdkmonitor: Gdk.Monitor) {
  return HorizontalBar(
    gdkmonitor,
    "topBar",
    Astal.WindowAnchor.TOP | Astal.WindowAnchor.LEFT | Astal.WindowAnchor.RIGHT,
    false,
  );
}

export function BottomBar(gdkmonitor: Gdk.Monitor) {
  return HorizontalBar(
    gdkmonitor,
    "bottomBar",
    Astal.WindowAnchor.BOTTOM |
      Astal.WindowAnchor.LEFT |
      Astal.WindowAnchor.RIGHT,
    false,
  );
}

export function SideBarLeft(gdkmonitor: Gdk.Monitor) {
  return HorizontalBar(
    gdkmonitor,
    "leftBar",
    Astal.WindowAnchor.TOP |
      Astal.WindowAnchor.LEFT |
      Astal.WindowAnchor.BOTTOM,
    true,
  );
}

export function SideBarRight(gdkmonitor: Gdk.Monitor) {
  return HorizontalBar(
    gdkmonitor,
    "rightBar",
    Astal.WindowAnchor.TOP |
      Astal.WindowAnchor.RIGHT |
      Astal.WindowAnchor.BOTTOM,
    true,
  );
}

export function BarWidget({
  gdkmonitor,
  Component,
  opts,
}: {
  gdkmonitor: Gdk.Monitor;
  Component: Gtk.Widget;
  opts: any;
}) {
  return <Component {...opts} />;
}
