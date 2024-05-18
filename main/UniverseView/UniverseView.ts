import { Data, Nebula, data } from "../data/Data";
import { span, li, btn, div } from "@/funcObject";
import { Universe } from "../data/components/Universe";
import { engine } from "@/engine";
import { ListSelector } from "../ListSelector/ListSelector";
import { ConvenientNebulaList } from "./convenience/ConvenientNebulaList";
import { SystemNebulaList } from "./system/SystemNebulaList";
import { CommonNebulaMap } from "./common/CommonNebulaMap";
import "./UniverseView.css";
import { UniverseMapInfo } from "./common/universeMap/universeMap";

export type UniverseViewInfo = {
  currentSecondWindow: {
    universe: "common" | "system" | "convenient" | "list"
  },
  currentThirdWindow: {
    universe: {
      system: "day" | "lifetime" | "importance" | "isolated"
    }
  }
  universeMap: UniverseMapInfo,
  selection: {
    universe?: Universe,
    nebula?: Nebula
  },
  data: Data
}
export const UniverseView = (info: UniverseViewInfo) => {
  const windows = {
    common: CommonNebulaMap(info),
    system: SystemNebulaList(info),
    convenient: ConvenientNebulaList(),
    list: ListSelector<Universe>({
      datas: data.universes,
      page: 1,
      keyword: "",
      capacity: 15,
      itemChildrenBuilder: u => [
        span()(u.name)
      ],
      filter: (u, s) => u.name.includes(s)
    })
  };

  const winName = info.currentSecondWindow;

  return div()([
    div({class: "universe-window-switch-box"})([
      btn({onclick: () => winName.universe = "common"}, {className: () => winName.universe === "common" ? "selected" : ""})("Common"),
      btn({onclick: () => winName.universe = "system"}, {className: () => winName.universe === "system" ? "selected" : ""})("System"),
      btn({onclick: () => winName.universe = "convenient"}, {className: () => winName.universe === "convenient" ? "selected" : ""})("Convenient"),
      btn({onclick: () => winName.universe = "list"}, {className: () => winName.universe === "list" ? "selected" : ""})("List")
    ]),
    div({ className: "universe-view"})(() => [windows[winName.universe]])
  ])
};
