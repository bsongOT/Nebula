import {Content, Nebula, data} from "./data/Data"
import { body, btn, div } from "@/funcObject";
import { P } from "@/utils/math/coord-system";
import { Universe } from "./data/components/Universe";
import { engine } from "@/engine";
import { UniverseView } from "./UniverseView/UniverseView";
import "./index.css"
import { NebulaView } from "./NebulaView/NebulaView";
import { ContentView } from "./ContentView/ContentView";
import { DustView } from "./DustView/DustView";

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
  currentWindow: "universe" as "universe"|"nebula"|"content"|"dust",
  currentSecondWindow: {
    universe: "common" as "common" | "system" | "convenient" | "list",
    nebula: "editor" as "editor" | "list",
    content: "editor" as "editor" | "list",
    dust: "claim" as "claim" | "kernel"
  },
  currentThirdWindow: {
    universe: {
      system: "day" as "day" | "lifetime" | "importance" | "isolated"
    }
  }
}

export const MainView = (info:{currentWindow:"universe"|"nebula"|"content"|"dust"}) => {
  const windows = {
    universe: UniverseView(memento),
    nebula: NebulaView({openedNebulaInfos:[]}, memento.data),
    content: ContentView(),
    dust: DustView(),
  }

  return div({className: "main-view"})(() => [windows[info.currentWindow]])
}

function switchWindow(windowKey:"universe" | "nebula" | "content" | "dust"){
  memento.currentWindow = windowKey
}

body(
  div({class: "current-window-switch-box"})([
    btn({onclick: () => switchWindow("universe")}, {className: () => memento.currentWindow === "universe" ? "selected" : ""})("Universe"),
    btn({onclick: () => switchWindow("nebula")}, {className: () => memento.currentWindow === "nebula" ? "selected" : ""})("Nebula"),
    btn({onclick: () => memento.currentWindow = "content"}, {className: () => memento.currentWindow === "content" ? "selected" : ""})("Content"),
    btn({onclick: () => memento.currentWindow = "dust"}, {className: () => memento.currentWindow === "dust" ? "selected" : ""})("Dust")
  ]),
  div({class: "current-second-window-switch-box"})([
    div({class: "universe-window-switch-box"})([
      btn({onclick: () => memento.currentSecondWindow.universe = "common"}, {className: () => memento.currentSecondWindow.universe === "common" ? "selected" : ""})("Common"),
      btn({onclick: () => memento.currentSecondWindow.universe = "system"}, {className: () => memento.currentSecondWindow.universe === "system" ? "selected" : ""})("System"),
      btn({onclick: () => memento.currentSecondWindow.universe = "convenient"}, {className: () => memento.currentSecondWindow.universe === "convenient" ? "selected" : ""})("Convenient"),
      btn({onclick: () => memento.currentSecondWindow.universe = "list"}, {className: () => memento.currentSecondWindow.universe === "list" ? "selected" : ""})("List")
    ]),
    div({class: "nebula-window-switch-box"})([
      btn({})("Editor"),
      btn()("List")
    ]),
    div({class: "content-window-switch-box"})([
      btn()("Editor"),
      btn()("List")
    ]),
    div()([
      btn()("Claim"),
      btn()("Kernel")
    ])
  ]),
  MainView(memento)
);