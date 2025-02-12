import { App, Gtk } from "astal/gtk3";
import { execAsync } from "astal/process";

export default function () {
  return (
    <box vertical={false} className="powerOptions" halign={Gtk.Align.CENTER}>
      <button
        className="logout icon"
        label="󰍃"
        onClicked={() => {
          App.toggle_window("systemInfo");
          execAsync("uwsm stop");
        }}
      />
      <button
        className="lock icon"
        label=""
        onClicked={() => {
          App.toggle_window("systemInfo");
          execAsync("uwsm app -- hyprlock");
        }}
      />
      <button
        className="restart icon"
        label=""
        onClicked={() => {
          App.toggle_window("systemInfo");
          execAsync("systemctl reboot");
        }}
      />
      <button
        className="shutdown icon"
        label="⏻"
        onClicked={() => {
          App.toggle_window("systemInfo");
          execAsync("systemctl poweroff");
        }}
      />
    </box>
  );
}
