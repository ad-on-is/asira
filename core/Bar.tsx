import { App, Astal, Gdk, Gtk } from "astal/gtk3";

import options from "core/init";

function Bar(
  gdkmonitor: Gdk.Monitor,
  key: "top" | "bottom" | "left" | "right",
  anchor: Astal.WindowAnchor,
  vertical: boolean,
) {
  const opts = options.bar[key];
  const widgets: { start: Function[]; center: Function[]; end: Function[] } =
    opts.widgets;
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
          {(widgets.start || []).map((w) => <box className="barItem" vertical={vertical}>{w(gdkmonitor)}</box>)}
        </box>
        <box vertical={vertical} className="col center">
          {(widgets.center || []).map((w) => <box className="barItem" vertical={vertical}>{w(gdkmonitor)}</box>)}
        </box>
        <box
          className="col end"
          halign={Gtk.Align.END}
          vertical={vertical}
          valign={Gtk.Align.START}
        >
          {(widgets.end || []).map((w) => <box className="barItem" vertical={vertical}>{w(gdkmonitor)}</box>)}
        </box>
      </centerbox>
    </window>
  );
}

export function TopBar(
  gdkmonitor: Gdk.Monitor,
) {
  return Bar(
    gdkmonitor,
    "top",
    Astal.WindowAnchor.TOP | Astal.WindowAnchor.LEFT | Astal.WindowAnchor.RIGHT,
    false,
  );
}

export function BottomBar(
  gdkmonitor: Gdk.Monitor,
) {
  return Bar(
    gdkmonitor,
    "bottom",
    Astal.WindowAnchor.BOTTOM |
    Astal.WindowAnchor.LEFT |
    Astal.WindowAnchor.RIGHT,
    false,
  );
}

export function SideBarLeft(
  gdkmonitor: Gdk.Monitor,
) {
  return Bar(
    gdkmonitor,
    "left",
    Astal.WindowAnchor.TOP |
    Astal.WindowAnchor.LEFT |
    Astal.WindowAnchor.BOTTOM,
    true,
  );
}

export function SideBarRight(
  gdkmonitor: Gdk.Monitor,
) {
  return Bar(
    gdkmonitor,
    "right",
    Astal.WindowAnchor.TOP |
    Astal.WindowAnchor.RIGHT |
    Astal.WindowAnchor.BOTTOM,
    true,
  );
}
