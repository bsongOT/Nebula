import { Data, Nebula, data } from "../data/Data";
import { span, li, btn, div } from "@/funcObject";
import { Universe } from "../data/components/Universe";
import { Parent } from "../../engine/objects/Parent";
import { engine } from "@/engine";
import { ListSelector } from "../components/ListSelector/ListSelector";
import { ConvenientNebulaList } from "./ConvenientNebulaList";
import { SystemNebulaList } from "./SystemNebulaList";
import { CommonNebulaMap } from "./CommonNebulaMap";
import "./UniverseView.css";
import { UniverseMapInfo } from "./universeMap/universeMap";

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
    list: new ListSelector<Universe>({
      datas: data.universes,
      page: 1,
      keyword: "",
      capacity: 15,
      itemChildrenBuilder: u => [
        span()(u.name)
      ],
      filter: (u, s) => u.name.includes(s)
    }).element
  };
  const window = [windows[info.currentSecondWindow.universe]];

  engine.updater.register(() => {
    window[0] = windows[info.currentSecondWindow.universe];
  });

  return div()( 
    div({class: "universe-window-switch-box"})(
      btn({onclick: () => info.currentSecondWindow.universe = "common"}, {className: () => info.currentSecondWindow.universe === "common" ? "selected" : ""})("Common"),
      btn({onclick: () => info.currentSecondWindow.universe = "system"}, {className: () => info.currentSecondWindow.universe === "system" ? "selected" : ""})("System"),
      btn({onclick: () => info.currentSecondWindow.universe = "convenient"}, {className: () => info.currentSecondWindow.universe === "convenient" ? "selected" : ""})("Convenient"),
      btn({onclick: () => info.currentSecondWindow.universe = "list"}, {className: () => info.currentSecondWindow.universe === "list" ? "selected" : ""})("List")
    ),
    Parent({ className: "universe-view", childArray: window })
  )
};
