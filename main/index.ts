import {Content, Nebula, data} from "./data/Data"
import { body, btn, div } from "@/funcObject";
import { P } from "@/utils/math/coord-system";
import { Universe } from "./data/components/Universe";
import "./index.css"
import { CommonNebulaMap } from "./UniverseView/common/CommonNebulaMap";
import { SystemNebulaList } from "./UniverseView/system/SystemNebulaList";
import { ConvenientNebulaList } from "./UniverseView/convenience/ConvenientNebulaList";
import { ListSelector } from "./ListSelector/ListSelector";
import { Dust } from "./data/components/Dust";
import { ContentEditor } from "./ContentView/ContentEditor";
import { NebulaEditor } from "./NebulaView/NebulaEditor";

type FirstWindowKey = "universe"|"nebula"|"content"|"dust";
type SecondWindowKeys = {
  universe: "common" | "system" | "convenient" | "list" 
  nebula: "editor" | "list"
  content: "editor" | "list"
  dust: "claim" | "kernel"
}

const memento = {
  universeMap: {
    size: 16,
    viewPoint: P(0, 0)
  },
  data: data,
  selection: {
    universe: undefined as Universe | undefined,
    nebula: undefined as Nebula | undefined,
    content: undefined as Content | undefined
  },
  currentWindow: "universe" as FirstWindowKey,
  currentSecondWindow: {
    universe: "common",
    nebula: "editor",
    content: "editor",
    dust: "claim"
  } as SecondWindowKeys,
  currentThirdWindow: {
    universe: {
      system: "day" as "day" | "lifetime" | "importance" | "isolated"
    }
  }
}

type MainViewInfo = {
  currentWindow: FirstWindowKey,
  currentSecondWindow: SecondWindowKeys
}

export const MainView = (info:MainViewInfo) => {
  const windows = {
    universe: {
      common: CommonNebulaMap(memento),
      system: SystemNebulaList(memento),
      convenient: ConvenientNebulaList(),
      list: ListSelector({
        datas: data.universes,
        itemChildrenBuilder: u => [
          div()(u.name)
        ],
        filter: (u, s) => u.name.includes(s)
      })
    },
    nebula: {
      editor: NebulaEditor({openedNebulaInfos: []}, data),
      list: ListSelector({
        datas: data.nebulas,
        itemChildrenBuilder: n => [
          div()(n.name)
        ],
        filter: (n, s) => n.name.includes(s)
      })
    },
    content: {
      editor: ContentEditor(),
      list: ListSelector({
        datas: data.contents,
        itemChildrenBuilder: c => [
          div()(c.title)
        ],
        filter: (c, s) => c.title.includes(s)
      })
    },
    dust: {
      claim: ListSelector({
        datas: data.dusts,
        itemChildrenBuilder: d => [
          div()(d.claim)
        ],
        filter: (d, s) => d.claim.includes(s)
      }),
      kernel: ListSelector({
        datas: data.dusts,
        itemChildrenBuilder: d => [
          div()(d.kernelPath)
        ],
        filter: d => d.kernelPath !== "" //TODO: check file exist?
      })
    }
  }
  
  return div({className: "main-view"})(() => [(windows[info.currentWindow] as any)[info.currentSecondWindow[info.currentWindow]]])
}

function switchWindow<T extends FirstWindowKey>(key:[T, SecondWindowKeys[T]?]){
  memento.currentWindow = key[0]
  if (!key[1]) return;
  memento.currentSecondWindow[key[0]] = key[1]
}

body(
  div({class: "current-window-switch-box"})([
    btn({onclick: () => switchWindow(["universe"])}, {className: () => memento.currentWindow === "universe" ? "selected" : ""})("Universe"),
    btn({onclick: () => switchWindow(["nebula"])}, {className: () => memento.currentWindow === "nebula" ? "selected" : ""})("Nebula"),
    btn({onclick: () => switchWindow(["content"])}, {className: () => memento.currentWindow === "content" ? "selected" : ""})("Content"),
    btn({onclick: () => switchWindow(["dust"])}, {className: () => memento.currentWindow === "dust" ? "selected" : ""})("Dust")
  ]),
  div({class: "current-second-window-switch-box"})([
    div({class: "switch-box"})([
      btn({onclick: () => switchWindow(["universe", "common"])}, {className: () => memento.currentSecondWindow.universe === "common" ? "selected" : ""})("Common"),
      btn({onclick: () => switchWindow(["universe", "system"])}, {className: () => memento.currentSecondWindow.universe === "system" ? "selected" : ""})("System"),
      btn({onclick: () => switchWindow(["universe", "convenient"])}, {className: () => memento.currentSecondWindow.universe === "convenient" ? "selected" : ""})("Convenient"),
      btn({onclick: () => switchWindow(["universe", "list"])}, {className: () => memento.currentSecondWindow.universe === "list" ? "selected" : ""})("List")
    ]),
    div({class: "switch-box"})([
      btn({onclick: () => switchWindow(["nebula", "editor"])}, {className: () => memento.currentSecondWindow.nebula === "editor" ? "selected" : ""})("Editor"),
      btn({onclick: () => switchWindow(["nebula", "list"])}, {className: () => memento.currentSecondWindow.nebula === "list" ? "selected" : ""})("List")
    ]),
    div({class: "switch-box"})([
      btn({onclick: () => switchWindow(["content", "editor"])}, {className: () => memento.currentSecondWindow.content === "editor" ? "selected" : ""})("Editor"),
      btn({onclick: () => switchWindow(["content", "list"])}, {className: () => memento.currentSecondWindow.universe === "list" ? "selected" : ""})("List")
    ]),
    div({class: "switch-box"})([
      btn({onclick: () => switchWindow(["dust", "claim"])}, {className: () => memento.currentSecondWindow.dust === "claim" ? "selected" : ""})("Claim"),
      btn({onclick: () => switchWindow(["dust", "kernel"])}, {className: () => memento.currentSecondWindow.dust === "kernel" ? "selected" : ""})("Kernel")
    ])
  ]),
  MainView(memento)
);