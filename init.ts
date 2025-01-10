import { App, Astal } from "astal/gtk3";
import { TopBar, BottomBar, SideBarLeft, SideBarRight } from "core/Bar";

import { DisplayNotifications } from "core/Notification";

import { MicrophoneOSD, VolumeOSD } from "plugins/builtin/audio/OSD";
import { BrightnessOSD } from "plugins/builtin/brightness/OSD";
import options from "options";

export function init() {
  const mainMonitor =
    App.get_monitors().find((m) => m.is_primary()) || App.get_monitors()[0];

  // Use TopBar|BottomBar|SieBarLeft|SideBarRight
  App.get_monitors().map(TopBar);
  App.get_monitors().map(BottomBar);
  // TopBar(mainMonitor);
  // App.get_monitors().map(DisplayNotifications);
  DisplayNotifications(mainMonitor);
  App.get_monitors().map(VolumeOSD);
  // VolumeOSD(mainMonitor)
  App.get_monitors().map(MicrophoneOSD);
  // MicrophoneOSD(mainMonitor);
  App.get_monitors().map(BrightnessOSD);
  // BrightnessOSD(mainMonitor)
}

export default options;
