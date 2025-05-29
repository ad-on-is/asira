import { Variable } from "astal";
import Wp from "gi://AstalWp";

export function getVolumeIcon(speaker?: Wp.Endpoint) {
  let volume = speaker?.volume;
  let muted = speaker?.mute;
  let speakerIcon = speaker?.icon;
  if (volume == null || speakerIcon == null) return "";

  if (speakerIcon.includes("bluetooth")) {
    if (volume === 0 || muted) {
      return "󰟎";
    } else {
      return "󰥰";
    }
  } else if (speakerIcon.includes("headset")) {
    if (volume === 0 || muted) {
      return "󰟎";
    } else {
      return "󰋋";
    }
  } else {
    if (volume === 0 || muted) {
      return "";
    } else if (volume < 0.33) {
      return "";
    } else if (volume < 0.76) {
      return "";
    } else {
      return "";
    }
  }
}

export function truncateDescription(desc: string) {
  let name = desc || "";
  const sp = name.split(" ");
  if (sp!.length > 2) {
    name = sp![0] + " " + sp![1];
  }
  // if (m!.transform > 0) {
  //   name = "";
  // }
  return name;
}

export function getMicrophoneIcon(mic?: Wp.Endpoint): string {
  let volume = mic?.volume;
  let muted = mic?.mute;
  let micIcon = mic?.icon;

  if (micIcon != null && micIcon.includes("bluetooth")) {
    if (volume === 0 || muted) {
      return "󰟎";
    } else {
      return "󰥰";
    }
  } else if (micIcon != null && micIcon.includes("headset")) {
    if (volume === 0 || muted) {
      return "󰋐";
    } else {
      return "󰋎";
    }
  } else {
    if (volume === 0 || muted) {
      return "󰍭";
    } else {
      return "";
    }
  }
}

export function toggleMuteEndpoint(endpoint?: Wp.Endpoint) {
  endpoint?.set_mute(!endpoint?.mute);
}


export const camInUse = Variable([]).poll(1000, ["bash", "-c", "lsof -Fn -- /dev/video* 2> /dev/null | sed 's/^n//' | uniq"], (o) => {
  if (o === "") {
    return []
  }
  o = o.replaceAll(" (stat: Operation not permitted)", "")
  const d = o.split("\n")
  return d as []

})

export const micInUse = Variable(false).poll(1000, ["bash", "-c", "pw-cli info $(pactl get-default-source) | grep 'state' | { grep 'running' || true; }"], (o) => o !== "");

