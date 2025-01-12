import { App } from "astal/gtk3";
import style from "./scss/main.scss";

import { handler, init } from "init";

App.start({
  css: style,
  main(...args: Array<string>) {
    init();
  },
  requestHandler(request: string, res: (response: any) => void) {
    handler(request, res);
    // if (request === "theme") {
    //   exec("sass --silent ./scss/main.scss ./style.css");
    //   App.apply_css("./style.css");
    //   res("ags theme applied");
    // } else if (request === "appLauncher") {
    //   App.toggle_window(AppLauncherWindowName);
    //   res("app launcher toggled");
    // } else if (request === "screenshot") {
    //   App.toggle_window(ScreenshotWindowName);
    //   res("screenshot toggled");
    // } else if (request.startsWith("screenshare")) {
    //   print(request.startsWith("screenshare"));
    //   updateWindows(request);
    //   updateResponse(res);
    //   App.toggle_window(ScreenshareWindowName);
    // } else {
    //   res("command not found");
    // }
  },
});
