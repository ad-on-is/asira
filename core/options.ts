import { Astal } from "astal/gtk3";

export default {
  notification: {
    position: Astal.WindowAnchor.BOTTOM | Astal.WindowAnchor.RIGHT,
    margin: [0, 50, 50, 0],
  },
  dateTime: {
    showWeather: true,
    timeFormat: "%H:%M:%S",
    dateFormat: "%a, %d.%b %Y",
  },
  systemInfo: {
    position:
      Astal.WindowAnchor.TOP |
      Astal.WindowAnchor.LEFT |
      Astal.WindowAnchor.BOTTOM,
  },
  overview: {
    position: Astal.WindowAnchor.TOP,
  },
  osd: {
    position: Astal.WindowAnchor.BOTTOM,
    margin: [0, 0, 100, 0],
  },
  leftBar: {
    margin: [5, 10, 10, 10],
    widgets: { start: [], center: [], end: [] },
  },
  rightBar: {
    margin: [5, 10, 10, 10],
    widgets: { start: [], center: [], end: [] },
  },
  bottomBar: {
    margin: [5, 10, 10, 10],
    widgets: {
      start: [],
      center: [],
      end: [],
    },
  },
  topBar: {
    margin: [5, 10, 0, 10],
    widgets: {
      start: [],
      center: [],
      end: [],
    },
  },
};
