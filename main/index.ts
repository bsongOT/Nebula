import { body, btn, div, hr, li, ul } from "@/funcObject";
import { P } from "@/utils/math/coord-system";
import "./index.css"
import { CommonNebulaMap } from "./Pages/UniverseView/CommonNebulaMap";
import { ContentEditor } from "./Pages/ContentPage/ContentPage";
import { NebulaPage } from "./Pages/NebulaPage/NebulaPage";
import { Repeat, Repeated, U } from "@/engine";
import context from "./context";
import { ListSelector } from "./ListSelector/ListSelector";
import { Content, Nebula } from "./data/Data";
import { Universe } from "./data/components/Universe";

const settings = {
  universeMapSize: 16,
  viewPoint: P(0, 0),
  
}

const windows = {
  "all-universes": div()(),
  "all-relations": div()(),
  "all-nebulas": ListSelector({
    datas: context.data.nebulas,
    componentBuilder: (info) => div({
      onclick: () => {
        context.selection.nebula = info.data
        selectedTab = "nebula"
        if (workspaceInfos.some(wi => "nebula" in wi.stack && wi.stack.nebula === info.data)) return;
        workspaceInfos.push({stack: {nebula: info.data, contents: []}})
      }
    })(() => info.data.name),
    filter: (content, search) => content.name.includes(search),
    onInsert: (name) => context.data.addNebula(new Nebula({
        name: name === "" ? undefined : name
    }), {
    }),
    onRemove: (nebulas) => {
        nebulas.forEach(n => context.data.removeNebula(n))
    }
  }),
  "all-contents": ListSelector({
    datas: context.data.contents,
    componentBuilder: (info) => div({
      onclick: () => {
        context.selection.content = info.data
        selectedTab = "content"
        if (workspaceInfos.some(wi => wi.stack === info.data)) return;
        workspaceInfos.push({stack: info.data})
      }
    })(() => info.data.title),
    filter: (content, search) => content.title.includes(search),
    onInsert: (name) => context.data.addContent(new Content({
        title: name === "" ? undefined : name
    }), {
        day: new Date()
    }),
    onRemove: (contents) => {
        contents.forEach(c => context.data.removeContent(c))
    }
  }),
  universe: CommonNebulaMap({
    universeMap: {
      size: settings.universeMapSize,
      viewPoint: settings.viewPoint
    }
  }),
  relation: div()(),
  nebula: NebulaPage({}),
  content: ContentEditor(),
  none: div()()
}

type Tab = "all-universes" | "all-relations" | "all-nebulas" | "all-contents" | "universe" | "relation" | "nebula" | "content" | "none"

let selectedTab = "none" as Tab;

type WorkspaceTabInfo = {
  stack:Content | {
    nebula:Nebula,
    contents:Content[]
  } | {
    universe:Universe,
    nebulaStack:{
      nebula:Nebula,
      contents:Content[]
    }[]
  }
}
const workspaceInfos = [] as WorkspaceTabInfo[];
function workspaceTab(info:WorkspaceTabInfo){
  const className = U(() => {
    if (info.stack instanceof Content) return selectedTab === "content" && info.stack === context.selection.content ? "selected" : "";
    if ("nebula" in info.stack) return selectedTab === "nebula" && info.stack.nebula === context.selection.nebula ? "selected" : "";
    return selectedTab === "universe" && info.stack.universe === context.selection.universe ? "selected" : "";    
  })
  const onclick = () => {
    if (info.stack instanceof Content) {
      context.selection = {
        universe: undefined,
        relation: undefined,
        nebula: undefined,
        content: info.stack
      }
      selectedTab = "content"
      return;
    }
    if ("nebula" in info.stack) {
      context.selection = {
        universe: undefined,
        relation: undefined,
        nebula: info.stack.nebula,
        content: undefined
      }
      selectedTab = "nebula";
      return;
    }
    return info.stack.universe.name; 
  }
  return (
    li({className, onclick})([
      div({className: "tab-step"})(() => {
        if (info.stack instanceof Content) return info.stack.title;
        if ("nebula" in info.stack) return info.stack.nebula.name;
        return info.stack.universe.name;
      })
    ])
  )
}

body(
  div({className: "top-left"})([

  ]),
  div({className: "top-right"})([
    btn({
      className: U(() => `${selectedTab === "content" ? "selected" : ""}`.trim()),
      onclick: () => {
        if (context.selection.content) selectedTab = "content"
        else selectedTab = "all-contents"
      }
    })("Content"),
    btn({
      className: U(() => `${selectedTab === "nebula" ? "selected" : ""}`.trim()),
      onclick: () => {
        if (context.selection.nebula) selectedTab = "nebula"
        else selectedTab = "all-nebulas"
      }
    })("Nebula"),
    btn({
      className: U(() => `${selectedTab === "relation" ? "selected" : ""}`.trim()),
      onclick: () => {
        if (context.selection.relation) selectedTab = "relation"
        else selectedTab = "all-relations"
      }
    })("Relation"),
    btn({
      className: U(() => `${selectedTab === "universe" ? "selected" : ""}`.trim()),
      onclick: () => {
        if (context.selection.content) selectedTab = "universe"
        else selectedTab = "all-universes"
      }
    })("Universe"),
    btn()("Holder")
  ]),  
  div({className: "left-side"})([
    div({
      className: U(() => `special-tab ${selectedTab === "all-universes" ? "selected" : ""}`.trim()),
      onclick: () => {
        selectedTab = "all-universes"
        context.selection = {
          content: undefined,
          nebula: undefined,
          relation: undefined,
          universe: undefined
        }
      }
    })("All Universes"),
    div({
      className: U(() => `special-tab ${selectedTab === "all-relations" ? "selected" : ""}`.trim()),
      onclick: () => {
        selectedTab = "all-relations"
        context.selection = {
          content: undefined,
          nebula: undefined,
          relation: undefined,
          universe: undefined
        }
      }
    })("All Relations"),
    div({
      className: U(() => `special-tab ${selectedTab === "all-nebulas" ? "selected" : ""}`.trim()),
      onclick: () => {
        selectedTab = "all-nebulas"
        context.selection = {
          content: undefined,
          nebula: undefined,
          relation: undefined,
          universe: undefined
        }
      }
    })("All Nebulas"),
    div({
      className: U(() => `special-tab ${selectedTab === "all-contents" ? "selected" : ""}`.trim()),
      onclick: () => {
        selectedTab = "all-contents"
        context.selection = {
          content: undefined,
          nebula: undefined,
          relation: undefined,
          universe: undefined
        }
      }
    })("All Contents"),
    hr()(),
    ul({className: "tab-list"})(Repeat(workspaceTab, workspaceInfos, wi => wi))
  ]),
  div({class: "main-view"})(() => [windows[selectedTab]])
);