import Apps from "gi://AstalApps";
import { App, Astal, astalify, ConstructProps, Gdk, Gtk } from "astal/gtk3";
import { GObject, Gio, Variable, bind } from "astal";
import { execAsync } from "astal/process";

class FlowBox extends astalify(Gtk.FlowBox) {
  static {
    GObject.registerClass(this);
  }

  constructor(
    props: ConstructProps<FlowBox, Gtk.FlowBox.ConstructorProps, {}>,
  ) {
    super(props as any);
  }
}



function hide() {
  App.get_window("launcher")!.hide();
}

function launchApp(app: Apps.Application) {
  execAsync(`uwsm app -- ${app.entry}`).catch((error) => {
    print(error);
  });
}

interface AppButtonProps {
  app: Apps.Application;
  isSelected: boolean;
}

function AppButton({
  app,
  isSelected,
}: AppButtonProps) {
  return (
    <button
      canFocus={false}
      className={isSelected ? "active" : ""}
      onClicked={() => {
        hide();
        launchApp(app);
      }}
    >
      <box vertical={true} className="entry">
        <box>
          <icon className="appIcon" icon={app.iconName} css={`font-size: 2rem; margin-right: 1rem;`} />
          <box vertical={true} valign={Gtk.Align.START}>
            <label className="medium title" truncate xalign={0} label={app.name} />
            <label label={app.description || "No description"} className="subtitle" halign={Gtk.Align.START} />
          </box>
        </box>
      </box>
    </button>
  );
}


export default function () {
  const { CENTER } = Gtk.Align;
  const apps = new Apps.Apps();

  const selectedIndex = Variable(0);
  const text = Variable("");
  const list = text((text) => {
    let listApps = apps
      .exact_query(text)
      .filter((app) => app.name.toLowerCase().includes(text.toLowerCase()) || (app.description || "").toLowerCase().includes(text.toLowerCase()) || app.categories.join(",").toLowerCase().includes(text.toLowerCase()))
      .sort((a, b) => {
        if (a.name === b.name) {
          return 0;
        }
        let aMatch = a.name.toLowerCase().startsWith(text.toLowerCase());
        let bMatch = b.name.toLowerCase().startsWith(text.toLowerCase());
        if (aMatch && bMatch) {
          if (a.name > b.name) {
            return 1;
          } else {
            return -1;
          }
        } else if (aMatch) {
          return -1;
        } else {
          return 1;
        }
      });
    if (listApps.length - 1 < selectedIndex.get()) {
      if (listApps.length === 0) {
        selectedIndex.set(0);
      } else {
        selectedIndex.set(listApps.length - 1);
      }
    }
    return listApps.slice(0, 8);
  });
  const onEnter = () => {
    if (list.get().length > 0) {
      const app = list.get()?.[selectedIndex.get()];
      if (app !== null) {
        launchApp(app);
      }
    }
    hide();
  };
  const listBinding = Variable.derive([list, selectedIndex]);


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
      }}
      onKeyPressEvent={function (self, event: Gdk.Event) {
        if (event.get_keyval()[1] === Gdk.KEY_Escape) {
          self.hide();
        } else if (
          event.get_keyval()[1] === Gdk.KEY_Down
        ) {
          selectedIndex.set(Math.min(selectedIndex.get() + 1, list.get().length - 1)
          );
        } else if (
          event.get_keyval()[1] === Gdk.KEY_Up
        ) {
          selectedIndex.set(Math.max(selectedIndex.get() - 1, 0))
        }
      }}
      css={`
        background: transparent;
      `}
      marginTop={100}
      marginBottom={5}
      visible={false}
    >
      <box className="window launcher">
        <box >
          <box className="" css={`min-height: 400px; min-width: 400px; padding: 1rem;`} vertical={true}>
            <box vertical={false}>
              <label className="icon" label="" />
              <entry
                className="medium"
                placeholderText="Search"
                css={`border: none; background: transparent;`}
                text={text()}
                onChanged={(self) => text.set(self.text)}
                onActivate={onEnter}
                hexpand={true}
              />
            </box>
            <scrollable
              className="scrollWindow"
              vscroll={Gtk.PolicyType.AUTOMATIC}
              propagateNaturalHeight={true}
              canFocus={false}
            >
              <box spacing={6} vertical={true}>
                {listBinding((value) =>
                  value[0].map((app, index) => (
                    <AppButton
                      app={app}
                      isSelected={index === value[1]}
                    />
                  )),
                )}
                <box
                  halign={CENTER}
                  vertical={true}
                  visible={list.as((l) => l.length === 0)}
                >
                  <label label="No match found" />
                </box>
                <box />
              </box>
            </scrollable>
          </box>

          <box css={`min-width: 400px; padding: 1rem;`} className="details" vertical={true} >

            {listBinding(([apps, i]) => (<>
              <box css={`margin-top: 2.5rem`}>

                <icon className="icon appicon" icon={apps[i].iconName} css={`font-size: 5rem;`} />
                <box vertical={true}>

                  <label className="large name" truncate label={apps[i].name} halign={Gtk.Align.START} />
                  <label label={apps[i].description || "No description"} className="description" wrap={true} halign={Gtk.Align.START} />
                </box>
              </box>

              <FlowBox css={`margin: 1rem 0`}>

                {apps[i].categories.map((category) => (<label label={category} className="tag category small" wrap={false} />))}
              </FlowBox>
              <label label={(apps[i].app as Gio.DesktopAppInfo).filename} css={`margin: 1rem 0;`} wrap={true} className="small entry" halign={Gtk.Align.START} />

            </>))}



            {/* <label label={listBinding(([apps, i]) => `${apps[i].name}`)} /> */}

            {/* <label label="test" /> */}

          </box>
        </box>

      </box>

    </window>
  );
}

