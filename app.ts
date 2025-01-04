// TODO:
// Razerbattery
// Cpu usage/temp
// RAM
// Filesystem
// wifi
// systray

import { App, Astal } from "astal/gtk3";
import style from "./scss/main.scss";
import TopBar from "core/bar/TopBar";
import Calendar from "plugins/builtin/calendar/Widgets";
import SystemMenuWindow from "core/systemMenu/SystemMenuWindow";
import DateTime from "plugins/builtin/datetime/Widgets";

import { VolumeOSD } from "plugins/builtin/audio/OSD";
import { BrightnessOSD } from "plugins/builtin/brightness/OSD";
import SideBar from "core/bar/SideBar";
import { exec } from "astal/process";
import NotificationPopups from "core/notification/NotificationPopups";
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
import Hyprland from "gi://AstalHyprland";
import options from "options";

App.start({
  css: style,
  main(...args: Array<string>) {
    const hyprland = Hyprland.get_default();
    const mainMonitor = hyprland.monitors.find((monitor) => monitor.id === 0);
    VolumeOSD();
    Calendar(Astal.WindowAnchor.TOP);
    SystemMenuWindow();
    BrightnessOSD();
    // ChargingAlertSound();
    App.get_monitors().map(TopBar);
    App.get_monitors().map(NotificationPopups);
    Screenshot();
    Screenshare();
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
