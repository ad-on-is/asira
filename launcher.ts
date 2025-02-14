import { App } from "astal/gtk3";
import style from "./scss/core/main.scss";

import { handlerLauncher, initLauncher } from "init";


App.start({
  css: style,
  instanceName: "asira-launcher",
  main(...args: Array<string>) {
    initLauncher();
  },
  requestHandler(request: string, res: (response: any) => void) {
    handlerLauncher(request, res);
    // if (request === "theme") {
    //   exec("sass --silent ./scss/main.scss ./style.css");
    //   App.apply_css("./style.css");
    //   res("ags theme applied");
    // } else if (request === "appLauncher") {

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
