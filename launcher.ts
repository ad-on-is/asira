import { App } from "astal/gtk3";
import style from "./scss/core/main.scss";

import Launcher from "core/Launcher";
import { init as appsInit, register as appsRegister } from "core/plugins/launcher/Apps"
import { init as customCommandsInit, register as customCommandsRegister } from "core/plugins/launcher/CustomCommands"


App.start({
  css: style,
  instanceName: "asira-launcher",
  main(...args: Array<string>) {
    Launcher();
    appsRegister()
    customCommandsRegister()
  },
  requestHandler(request: string, res: (response: any) => void) {
    App.toggle_window("launcher");
    appsInit()
    customCommandsInit()
    res("ok");

  },
});
