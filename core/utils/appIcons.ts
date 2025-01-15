import Apps from "gi://AstalApps";


class AppIcon {
  cache: { [className: string]: string } = {};
  appList: Apps.Application[] = []

  constructor() {
    this.refresh();
  }

  get(search: string[]) {

    for (const s of search) {
      if (this.cache[s]) {
        return this.cache[s]
      }
    }

    for (const s of search) {
      const app = this.appList.find(
        (a) =>
          a.name.toLowerCase().includes(s.toLowerCase())
      );

      if (app) {
        this.cache[s] = app.iconName;
        return app.iconName;
      }

    }
    return "";
  }

  refresh() {
    const apps = new Apps.Apps();
    this.appList = apps.list;
  }



}

const appIcon = new AppIcon();
export default appIcon;
