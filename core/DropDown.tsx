import { Gtk } from "astal/gtk3";
import { bind, Binding, Variable } from "astal";
import { DropDownArrowButton } from "./Button";

export function ButtonDropdown({
  icon,
  label,
  content,
}: {
  icon: string | Binding<string>;
  label: string | Binding<string>;
  content: Gtk.Widget;
}) {
  const isOpen = Variable(false);
  return (
    <box vertical={true} className="dropdown">
      <button
        hexpand={true}
        onClicked={() => {
          isOpen.set(!isOpen.get());
        }}
      >
        <box>
          <label className="icon" label={icon} />
          <label halign={Gtk.Align.START} label={label} />
        </box>
      </button>
      <revealer revealChild={isOpen()}>
        <box vertical={true}>{content}</box>
      </revealer>
    </box>
  );
}

export function ArrowButton({
  onClicked,
  isOpen,
}: {
  onClicked: Function;
  isOpen: Variable<boolean>;
}) {
  return (
    <button
      className="icon arrow"
      label={bind(isOpen).as((open) => (open ? "" : ""))}
      onClicked={() => {
        isOpen.set(!isOpen.get());
        if (onClicked !== null && isOpen.get() === true) {
          onClicked();
        }
      }}
    />
  );
}

export function ArrowDropdown({
  label,
  icon,
  content,
  onClicked,
}: {
  label: string | Binding<string>;
  icon: string | Binding<string>;
  content: Gtk.Widget;
  onClicked: Function;
}) {
  const isOpen = Variable(false);
  return (
    <box vertical={true} className="dropdown">
      <box vertical={false}>
        <label className="icon" label={icon} />
        <label
          halign={Gtk.Align.START}
          hexpand={true}
          truncate={true}
          className="name"
          label={label}
        />

        <ArrowButton isOpen={isOpen} onClicked={onClicked} />
      </box>
      <revealer revealChild={isOpen()}>{content}</revealer>
    </box>
  );
}
