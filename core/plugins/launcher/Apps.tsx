import Apps from "gi://AstalApps";
import { App, Astal, astalify, ConstructProps, Gdk, Gtk } from "astal/gtk3";
import { GObject, Gio, Variable, bind, idle } from "astal";
import { execAsync } from "astal/process";
import { registerItems, text } from "core/Launcher"

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

function launchApp(app: Apps.Application) {
  execAsync(`uwsm app -- ${app.entry}`).catch((error) => {
    print(error);
  });
}


interface Recent {
  count: number;
  app: Apps.Application
}

let apps: Apps.Application[] = [];
const recents: Recent[] = [];

function addToRecents(app: Apps.Application) {
  const exists = recents.find((e) => e.app.name === app.name)
  if (exists) {
    exists.count = recents.length + 1;
    const idx = recents.indexOf(exists)
    recents[idx] = exists
  } else {
    recents.push({
      count: recents.length + 1, app: app
    })
  }
}

function convertItem(app: Apps.Application) {
  let cats = ["Uncategorized"]
  if (app.categories.length > 0) {
    cats = app.categories
  }

  return {

    icon: app.iconName,
    prefix: "",
    title: app.name,
    subtitle: app.description,
    source: "apps",
    onEnter: () => {
      addToRecents(app)
      launchApp(app)
    },
    detail: () => (<box vertical={true}>
      <box>
        <box css={`min-width: 5rem;`}>
          <icon className="icon appicon" icon={app.iconName} css={`font-size: 5rem;`} />
        </box>

        <label className="large name" label={app.name} wrap halign={Gtk.Align.START} xalign={0} />


      </box>

      <FlowBox sensitive={false} css={`margin: 1rem 0;`}>

        {cats.map((category) => (<label label={category} className="tag category small" />))}
      </FlowBox>
      <label label={(app.description || "No description").trim()} wrap className="description" xalign={0} halign={Gtk.Align.START} />


      <box vexpand />

      <label label={`  ${(app.app as Gio.DesktopAppInfo).filename}`} xalign={0} css={`opacity: 0.5;`} wrap className="small entry" halign={Gtk.Align.START} />

    </box>)
  }


}

function getItems(text: string) {
  const items = apps
    .filter((app) => app.name.toLowerCase().includes(text.toLowerCase()) || (app.description || "").toLowerCase().includes(text.toLowerCase()) || app.categories.join(",").toLowerCase().includes(text.toLowerCase()))
    .sort((a, b) => {
      if (a.name === b.name) {
        return 0;
      }
      let aMatch = a.name.toLowerCase().includes(text.toLowerCase());
      let bMatch = b.name.toLowerCase().includes(text.toLowerCase());
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



  return items.slice(0, Math.min(items.length, 30)).map((app: Apps.Application) => convertItem(app))


}

export function register() {
  text.subscribe((text) => {
    if (text === "") {
      console.log(recents.sort((a, b) => a.count > b.count ? 0 : 1).map((r) => `${r.app.name}: ${r.count}`))
      registerItems("apps", recents.map((r) => convertItem(r.app)))
      return
    }
    idle(() => {

      const items = getItems(text)
      registerItems("apps", items)
    })
  })


}


export function init() {
  apps = new Apps.Apps().list;

}







