import { btn, div, span } from "@/funcObject";
import "./SystemNebulaList.css"
import { ListSelector } from "../../../ListSelector/ListSelector";
import { Content, Data } from "../../../data/Data";
import { DayNebulaList } from "./DayNebulaList";
import { LifetimeNebulaList } from "./LifetimeNebulaList";
import { ImportanceNebulaList } from "./ImportanceNebulaList";

type SystemNebulaListInfo = {
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
  let windowName = "day" as keyof typeof windows;
  
  return div()([
    div({ class: "system-nebula-switch-box" })([
      btn({onclick: () => windowName = "day"}, {className: () => windowName === "day" ? "selected" : ""})("Day"),
      btn({onclick: () => windowName = "lifetime"}, {className: () => windowName === "lifetime" ? "selected" : ""})("Lifetime"),
      btn({onclick: () => windowName = "importance"}, {className: () => windowName === "importance" ? "selected" : ""})("Importance"),
      btn({onclick: () => windowName = "isolated"}, {className: () => windowName === "isolated" ? "selected" : ""})("Isolated")
    ]),
    div({className: "system-nebula-list"})(() => [windows[windowName]])
  ]);
};
