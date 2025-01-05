// TODO:
// Razerbattery
// Cpu usage/temp
// RAM
// Filesystem
// wifi
// systray

import { App, Astal } from "astal/gtk3";
import style from "./scss/main.scss";
import Overview from "plugins/builtin/overview/Widgets";
import SystemMenuWindow from "plugins/builtin/systemInfo/Widgets";

import { exec } from "astal/process";
import AppLauncher, {
  AppLauncherWindowName,
} from "plugins/appLauncher/AppLauncher";
import Screenshot, {
  ScreenshotWindowName,
} from "plugins/screenshot/Screenshot";
import Screenshare, {
  ScreenshareWindowName,
  updateResponse,
  updateWindows,
} from "plugins/screenshare/Screenshare";
import { init } from "options";

App.start({
  css: style,
  main(...args: Array<string>) {
    init();
  },
  requestHandler(request: string, res: (response: any) => void) {
    if (request === "theme") {
      exec("sass ./scss/main.scss ./style.css");
      App.apply_css("./style.css");
      res("ags theme applied");
    } else if (request === "appLauncher") {
      App.toggle_window(AppLauncherWindowName);
      res("app launcher toggled");
    } else if (request === "screenshot") {
      App.toggle_window(ScreenshotWindowName);
      res("screenshot toggled");
    } else if (request.startsWith("screenshare")) {
      print(request.startsWith("screenshare"));
      updateWindows(request);
      updateResponse(res);
      App.toggle_window(ScreenshareWindowName);
    } else {
      res("command not found");
    }
  },
});
