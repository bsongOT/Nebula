import { btn, div, span } from "@/funcObject";
import "./SystemNebulaList.css"
import { ListSelector } from "../../ListSelector/ListSelector";
import { Content, Data, data } from "../../data/Data";
import { engine } from "@/engine";
import { DayNebulaList } from "./DayNebulaList";
import { LifetimeNebulaList } from "./LifetimeNebulaList";
import { ImportanceNebulaList } from "./ImportanceNebulaList";

type SystemNebulaListInfo = {
  currentThirdWindow:{
    universe: {
      system: "day" | "lifetime" | "importance" | "isolated"
    }
  },
  data:Data
}

export const SystemNebulaList = (info:SystemNebulaListInfo) => {
  const windows = {
    day: DayNebulaList({period: 1}, info.data),
    lifetime: LifetimeNebulaList(info),
    importance: ImportanceNebulaList({interval: 1}),
    isolated: ListSelector<Content>({
      datas: info.data.systemNebulas.isolated,
      page: 1,
      keyword: "",
      capacity: 15,
      itemChildrenBuilder: c => [
        span()(c.title)
      ],
      filter: (c, s) => c.title.includes(s)
    })
  };
  const windowInfo = info.currentThirdWindow.universe;
  const window = [windows[windowInfo.system]];

  engine.updater.register(() => {
    window[0] = windows[windowInfo.system];
  });
  
  return div()([
    div({ class: "system-nebula-switch-box" })([
      btn({onclick: () => windowInfo.system = "day"}, {className: () => windowInfo.system === "day" ? "selected" : ""})("Day"),
      btn({onclick: () => windowInfo.system = "lifetime"}, {className: () => windowInfo.system === "lifetime" ? "selected" : ""})("Lifetime"),
      btn({onclick: () => windowInfo.system = "importance"}, {className: () => windowInfo.system === "importance" ? "selected" : ""})("Importance"),
      btn({onclick: () => windowInfo.system = "isolated"}, {className: () => windowInfo.system === "isolated" ? "selected" : ""})("Isolated")
    ]),
    div({className: "system-nebula-list"})(window)
  ]);
};
