import { App, Astal, Gtk, Gdk } from "astal/gtk3";

import options from "core/init";

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

          {opts.widgets.start.filter(({ m }: { m: [] }) => typeof m === "undefined" || m.includes(gdkmonitor?.model)).map(({ Component, o, m }: { Component: Gtk.Widget, o: any, m: string[] }) => (
            <Component gdkmonitor={gdkmonitor} opts={o} />
          ))}
        </box>
        <box vertical={vertical} className="col center">
          {opts.widgets.center.filter(({ m }: { m: [] }) => typeof m === "undefined" || m.includes(gdkmonitor.model)).map(({ Component, o, m }) => (
            <Component gdkmonitor={gdkmonitor} opts={o} />
          ))}
        </box>
        <box
          className="col end"
          halign={Gtk.Align.END}
          vertical={vertical}
          valign={Gtk.Align.START}
        >

          {opts.widgets.end.filter(({ m }: { m: [] }) => typeof m === "undefined" || m.includes(gdkmonitor.model)).map(({ Component, o, m }) => (
            <Component gdkmonitor={gdkmonitor} opts={o} />
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

