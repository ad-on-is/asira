import { App, Astal, Gdk, Gtk } from "astal/gtk3";
import { Variable, bind, idle } from "astal";

const elementHeight = Variable(0);

const selectedIndex = Variable(0);
const items = Variable<Array<LauncherItem>>([]);
export const text = Variable("");
import { debounce } from "core/utils/helpers"

export interface LauncherItem {
  icon?: string;
  prefix?: string;
  title: string;
  subtitle: string;
  onEnter: Function;
  source: string;
  detail: Function;
}

function ItemButton({ item, index }: { item: LauncherItem, index: number }) {
  return (
    <button
      canFocus={false}
      hasFocus={false}
      setup={(self) => {
        if (index === 0) {
          elementHeight.set(self.get_preferred_height()[0])
        }
      }}
      className={bind(selectedIndex).as((i) => i === index ? "active" : "")}
      onClicked={() => {
        hide();
        item.onEnter()
      }}
    >
      <box className="entry" css={`min-height: 40px;`}>
        <box css={`min-width: 3rem;`} valign={Gtk.Align.CENTER}>

          {item.icon ? <icon className="appIcon" icon={item.icon} css={`font-size: 1.5rem`} /> : <label label={item.prefix || ""} className="appIcon" css={`font-size: 1.5rem`} />}
        </box>
        <box vertical={true} valign={Gtk.Align.START}>
          <label className="medium title" truncate xalign={0} label={item.title} />
          <label label={item.subtitle || "No description"} truncate className="subtitle" halign={Gtk.Align.START} />
        </box>
      </box>
    </button>
  );
}


export function registerItems(source: string, incoming: LauncherItem[]) {
  idle(() => {
    const current = items.get().filter((i) => i.source !== source)
    current.push(...incoming)
    items.set(current)

  })
}




function hide() {
  App.get_window("launcher")!.hide();
}

export default function () {


  const adjustment = Variable(new Gtk.Adjustment({}));

  const scrollWindow = (dir: string, index: number) => {
    const current = adjustment.get();
    const pos = current.value;
    const step = elementHeight.get();
    switch (dir) {
      case "down":
        if (index > 6) {
          current.value = pos + step;
          break;
        }
        break;
      case "up":
        current.value = pos - step;
        break;
      case "top":
        current.value = 0;
        break;
    }
    // adjustment.set(current);
  };

  const detailsBinding = Variable.derive([items, selectedIndex]);


  return (
    <window
      name="launcher"
      anchor={Astal.WindowAnchor.NONE}
      exclusivity={Astal.Exclusivity.IGNORE}
      keymode={Astal.Keymode.EXCLUSIVE}
      layer={Astal.Layer.TOP}
      application={App}
      onShow={() => {
        text.set("");
        selectedIndex.set(0);
        scrollWindow("top", 0);
      }}
      onKeyPressEvent={function (self, event: Gdk.Event) {
        if (event.get_keyval()[1] === Gdk.KEY_Escape) {
          self.hide();
        } else if (event.get_keyval()[1] === Gdk.KEY_Down) {
          selectedIndex.set(Math.min(selectedIndex.get() + 1, items.get().length - 1));
          scrollWindow("down", selectedIndex.get());
        } else if (event.get_keyval()[1] === Gdk.KEY_Up) {
          selectedIndex.set(Math.max(selectedIndex.get() - 1, 0));
          scrollWindow("up", selectedIndex.get());
        }
      }}
      css={`
        background: transparent;
      `}
      visible={false}
    >
      <box className="window launcher">
        <box
          className="inner"
          css={`
            min-height: 350px;
          `}
          vertical={true}
        >

          <box vertical={false}>
            <label className="icon" label="" />
            <entry
              className="medium"
              placeholderText="Search"
              css={`
                border: none;
                background: transparent;
              `}
              text={text()}
              onChanged={(self) => {
                const f =
                  debounce(100, () => {
                    selectedIndex.set(0);
                    text.set(self.text);
                    scrollWindow("top", 0);

                  })
                f()
              }}
              onActivate={() => {
                const item = items.get()[selectedIndex.get()]
                if (item) {
                  item.onEnter()
                }
                hide();
              }}
              hexpand={true}
              canFocus={true}
              hasFocus={true}
            />
          </box>
          <box
            className="inner"
            css={`
              min-width: 800px;
            `}
          >
            <box>
              <box className="" css={`min-width: 400px; padding: 0rem 1rem;`} vertical={true}>
                <scrollable
                  className="scrollWindow"
                  canFocus={false}
                  hscroll={Gtk.PolicyType.AUTOMATIC}
                  propagateNaturalHeight={true}
                  vadjustment={bind(adjustment)}

                >
                  <box vertical={true}>
                    {
                      bind(items).as((items) => items.map((i, index) => (<ItemButton item={i} index={index} />)))
                    }
                    <box />
                  </box>
                </scrollable>
              </box>
              <box className="divider" css={`min-height: 300px`} />
              <box css={`min-width: 400px; padding: 1rem;`} className="details" vertical={true} >
                {detailsBinding(([items, index]) => (items[index]?.detail() || <box />))}
              </box>

            </box>
          </box>
        </box>
      </box>
    </window>
  );
}



