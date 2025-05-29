import { App } from "astal/gtk3";
import style from "./scss/core/main.scss";

import { handler, init } from "init";


App.start({
  css: style,
  instanceName: "asira-shell",
  main(...args: Array<string>) {
    init();
  },
  requestHandler(request: string, res: (response: any) => void) {
    handler(request, res);
  }
});
