import {Content, Nebula, data} from "./data/Data"
import { body, btn, div } from "@/funcObject";
import { P } from "@/utils/math/coord-system";
import { Universe } from "./data/components/Universe";
import { Parent } from "../engine/objects/Parent";
import { engine } from "@/engine";
import { UniverseView } from "./UniverseView/UniverseView";
import "./index.css"

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
    nebula: div()(),
    content: div()(),
    dust: div()(),
  }
  const currentWindows = [windows[info.currentWindow]];

  engine.updater.register(() => {
    currentWindows[0] = windows[info.currentWindow]
  })

  return Parent({className: "main-view", childArray: currentWindows})
}

body(
  div({class: "current-window-switch-box"})(
    btn({onclick: () => memento.currentWindow = "universe"}, {className: () => memento.currentWindow === "universe" ? "selected" : ""})("Universe"),
    btn({onclick: () => memento.currentWindow = "nebula"}, {className: () => memento.currentWindow === "nebula" ? "selected" : ""})("Nebula"),
    btn({onclick: () => memento.currentWindow = "content"}, {className: () => memento.currentWindow === "content" ? "selected" : ""})("Content"),
    btn({onclick: () => memento.currentWindow = "dust"}, {className: () => memento.currentWindow === "dust" ? "selected" : ""})("Dust")
  ),
  MainView(memento)
);