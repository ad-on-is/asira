import { Variable, bind } from "astal";

export function DropDownArrowButton({ onClick }: { onClick: Function }) {
  const isOpen = Variable(false);
  return (
    <button
      className="icon dropdown"
      label={bind(isOpen).as((open) => (open ? "" : ""))}
      onClicked={() => {
        isOpen.set(!isOpen.get());
        onClick();
      }}
    />
  );
}
