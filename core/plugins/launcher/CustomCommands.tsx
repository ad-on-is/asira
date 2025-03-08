import { execAsync } from "astal"
import { registerItems, text } from "core/Launcher"

const source = "customCommands"


const items = [
  { source: source, prefix: "󰑓", title: "Reboot", subtitle: "Reboot system", onEnter: () => { execAsync(`systemctl reboot --now`) }, detail: () => <box /> },
  { source: source, prefix: "󰑓", title: "Reboot to BIOS", subtitle: "Reboot to BIOS", onEnter: () => { execAsync(`systemctl reboot --firmware-setup`) }, detail: () => <box /> },
  { source: source, prefix: "", title: "Shut down", subtitle: "Fully shut down", onEnter: () => { execAsync(`systemctl shutdown`) }, detail: () => <box /> },
  { source: source, prefix: "󰗽", title: "Logout", subtitle: "Logout current user", onEnter: () => { execAsync(`uwsm stop`) }, detail: () => <box /> },
  { source: source, prefix: "󰌾", title: "Lock", subtitle: "Lock screen", onEnter: () => { execAsync(`systemctl reboot now`) }, detail: () => <box /> }
]

export function register() {
  text.subscribe((text) => {
    if (text === "") {
      registerItems(source, [])
      return
    }
    registerItems(source, items.filter((i) => i.title.toLowerCase().includes(text) || i.subtitle.toLowerCase().includes(text)))
  })


}


export function init() {
  // apps = new Apps.Apps().list;

}
