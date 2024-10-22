import { body, btn, div, hr, inputText, li, span, ul } from "@/funcObject";
import { Coord, H, HexCoord, P } from "@/utils/math/coord-system";
import "./index.css"
import { ContentEditor } from "./Pages/ContentPage/ContentPage";
import { NebulaModel } from "./Pages/NebulaPage/NebulaPage";
import { either, engine, one, Repeat, U } from "@/engine";
import context from "./context";
import { Content, Nebula } from "./data/Data";
import { HexGrid } from "@/data-structure/hexgrid";
import { NestingList } from "./Pages/NebulaPage/NestingList";
import { toPaths } from "@/data-structure/utils";
import { Tree, TreeNode } from "@/data-structure/tree";
import { Relation } from "./data/components/Relation";
import { TabWrapper } from "./Components/TabWrapper";
import { RelationCreator } from "./Pages/DefaultPlugins/RelationCreator";

document.addEventListener("keydown", e => {
  if ((e.ctrlKey || e.metaKey) && e.code === 'Slash'){
    context.screenSplit = !context.screenSplit;
    return;
  }
  if ((e.ctrlKey || e.metaKey) && e.code === 'KeyT'){
    e.preventDefault();
    e.stopImmediatePropagation();
    const newTab = {};
    context.selection = newTab;
    context.tabs.push(newTab);
    return;
  }
})

export class Hexagon {
  constructor(
    public center:Coord,
    public side:number
  ){}
  render(ctx:CanvasRenderingContext2D){
    const side = this.side;
    const points = [
      [0, -side], [0.866 * side, -side / 2], [0.866 * side, side / 2],
      [0, side],  [-0.866 * side, side / 2], [-0.866 * side, -side / 2],
    ].map(p => P(Math.round(p[0] + this.center.x), Math.round(p[1] + this.center.y)));

    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y)
    ctx.lineTo(points[1].x, points[1].y)
    ctx.lineTo(points[2].x, points[2].y)
    ctx.lineTo(points[3].x, points[3].y)
    ctx.lineTo(points[4].x, points[4].y)
    ctx.lineTo(points[5].x, points[5].y)
    ctx.closePath()
    ctx.stroke()
    ctx.fill();
  }
}
function toWorldPos(cv:HTMLCanvasElement, size:number, h:HexCoord){
  const canvasCenter = P(cv.width / 2, cv.height / 2);
  const coordCenter = H(0, size - 1, 0);
  const side = 0.95 * Math.min(
    (cv.width) / (Math.sqrt(3) * (2 * size - 1)),
    (cv.height) / (3 * size - 1)      
  )

  return h.sub(coordCenter).toCoord(side).add(canvasCenter);
}
export function UniverseView(){
  const cv = document.createElement("canvas");
  const ctx = cv.getContext("2d")!;
  
  let size = 15;
  let mouseX = 0;
  let mouseY = 0;
  let targetPos = undefined as HexCoord | undefined;
  
  cv.style.width = "100%";
  cv.style.height = "100%";

  cv.onmousemove = e => {
    const r =  cv.getBoundingClientRect();
    mouseX = e.clientX - r.left;
    mouseY = e.clientY - r.top;
  }
  
  cv.onclick = () => {
    if (!targetPos) return;
    if (!context.selection.universe) return;
    if (!context.selection.nebula) return;
    const location = context.selection.universe.nebulaLocations.find(nl => nl.nebula === context.selection.nebula);
    if (!location) return;
    location.start = targetPos;
  }

  function update(){
    if (!context.selection.universe) return;
    cv.width = cv.scrollWidth;
    cv.height = cv.scrollHeight;

    const canvasCenter = P(cv.width / 2, cv.height / 2);
    const coordCenter = H(0, size - 1, 0);

    const side = 0.95 * Math.min(
      (cv.width) / (Math.sqrt(3) * (2 * size - 1)),
      (cv.height) / (3 * size - 1)      
    )

    ctx.clearRect(0, 0, cv.width, cv.height);
    ctx.strokeStyle = "#000";
    ctx.fillStyle = "#f7f7f7";

    for (const pos of new HexGrid(H(1,1,1).scale(size)).range){
      const worldPos = pos.sub(coordCenter).toCoord(side).add(canvasCenter);
      new Hexagon(worldPos, side).render(ctx)
    }

    for (const location of context.selection.universe.nebulaLocations){
      const paths = toPaths(location.nebula.tree);
      const start = location.start;
      if (start.eq(H(-1, 0, 0))) continue;
      const path = paths[location.pathIndex];
      if (!path) continue;
      if (path.length === 0) continue;
      ctx.beginPath()
      const firstWorldPos = toWorldPos(cv, size, path[0].pos.add(start));
      ctx.moveTo(firstWorldPos.x, firstWorldPos.y);
      for (const point of path){
        const wp = toWorldPos(cv, size, point.pos.add(start));
        ctx.lineTo(wp.x, wp.y);
      }
      ctx.stroke();
    }

    if (!context.selection.nebula) return;

    for (const pos of new HexGrid(H(1,1,1).scale(size)).range){
      const worldPos = pos.sub(coordCenter).toCoord(side).add(canvasCenter);
      if ((worldPos.x - mouseX) ** 2 + (worldPos.y - mouseY) ** 2 < side ** 2){
        const paths = toPaths(context.selection.nebula.tree)
        const path = paths[0]
        if (!path) continue;
        if (!path[0]) continue;
        ctx.beginPath()
        const firstWorldPos = toWorldPos(cv, size, path[0].pos.add(pos));
        ctx.moveTo(firstWorldPos.x, firstWorldPos.y);
        for (const point of path){
          const wp = toWorldPos(cv, size, point.pos.add(pos));
          ctx.lineTo(wp.x, wp.y);
        }
        ctx.stroke();

        targetPos = pos;
        break;
      }
    }
  }

  engine.updater.register(update);

  return cv;
}

const universeView = UniverseView();

export function NebulaPage(){
  return (
    div({ class: "nebula-page" })(
      inputText({
        className: "title",
        value: U(() => context.selection.universe?.name ?? "")
      })(),
      div({inlineStyle: U(() => ({
        position: "absolute",
        left: "50%",
        translate: "-50%",
        display: context.waitingContents.length > 0 ? "" : "none" 
      }))
      })([
        div()(() => `새 네뷸라 구성 중 (${context.waitingContents.length})`),
        btn({onclick: () => context.waitingContents = []})("취소"),
        btn({onclick: () => {
          const name = prompt("네뷸라 이름을 입력하십시오.") ?? undefined;
          const tree = new Tree<Content>()
          for (const contentNode of context.waitingContents)
            tree.insert(new TreeNode(tree, contentNode.data));
          context.data.addNebula(new Nebula({ name, tree}))
          context.waitingContents = [];
          console.log(context.data.nebulas);
        }})("완료")
      ]),
      div({
        inlineStyle: {
          flexGrow: "1",
          overflow: "hidden"
        }
      })(one([
        {
          if: () => context.selection.nebula,
          then: NebulaModel()
        },{
          if: () => context.selection.universe,
          then: universeView
        },{
          if: () => !context.selection.universe,
          then: div()()
        }
      ]))
    )
  )
}

function HolderOpener(){
  function getHolderNoticeCount(){
    const comps = context.heldComponents;
    return (comps.content.length + comps.nebula.length + comps.relation.length + comps.universe.length).toString();
  }
  return (
    div()(
      btn({
        className: "holder-opener",
        onclick: () => isHolderOpened = !isHolderOpened
      })("Holder"),
      span({ class: "holder-notice" })(getHolderNoticeCount)
    )
  )
}
function Holder(){
  return (
    div()([
      
    ])
  )
}
function StaticToolBox(){
  return (
    div({ class: "static-tool-box" })(
      HolderOpener(),
      btn({class: "material-symbols-outlined", inlineStyle: {border: "none", background: "none"}, onclick: () => {}})("more_horiz"),
      ul({
        class: "holder-list",
        inlineStyle: U(() => ({
          display: isHolderOpened ? "" : "none",
        }))
      })(Repeat(
        (i:{componentInfo:{content: Content, selected:boolean}}) => li({inlineStyle: {
          display: "flex",
          padding: "5px",
          gap: "5px"
        }})(
          inputText({
            type: "checkbox", 
            checked: U(() => i.componentInfo.selected),
            onchange: e => i.componentInfo.selected = (<HTMLInputElement>e.target).checked
          })(),
          div()(() => i.componentInfo.content.title)
        ),
        () => context.heldComponents.content.map(c => ({componentInfo: c}))
      ))
    )
  )
}

export function treeLeafs<T>(tree:Tree<T>){
  return tree.traverse().map(i => i.node).filter(n => n.children.length === 0);
}

function RelationView(){
  return (
    div({class: "relation-view"})(
      div({class: "title"})(() => {
        if (!context.selection.relation) return "";
        return `${context.selection.relation.mainTree.name} - ${context.selection.relation.secondTree.name}`
      }),
      div({ class: "relation-table" })(
        div()(),
        div({inlineStyle: {display: "flex"}})(Repeat(
          i => div({
            className: U(() => context.selection.content === i.node.data ? "selected" : ""),
            inlineStyle: {cursor: "s-resize", width: "20px", writingMode: "vertical-lr", textOrientation: "sideways", scale: "-1"},
            onclick: () => context.selection.content = i.node.data})(() => i.node.data.title),
          () => {
            if (!context.selection.relation) return [];
            return treeLeafs(context.selection.relation.mainTree.tree).map(n => ({node: n}))
          }
        )),
        div({inlineStyle: {display: "flex", flexDirection: "column"}})(Repeat(
          i => div({
            className: U(() => context.selection.content === i.node.data ? "selected" : ""),
            inlineStyle: {cursor: "e-resize", height: "20px"}, onclick: () => context.selection.content = i.node.data})(() => i.node.data.title),
          () => {
            if (!context.selection.relation) return [];
            return treeLeafs(context.selection.relation.secondTree.tree).map(n => ({node: n}))
          }
        )),
        div()(Repeat(
          i => div({inlineStyle: {display: "flex"}})(
            Repeat(
              i => div({inlineStyle: U(() => {
                return {
                  width: i.main === context.selection.content ? "18px" : "20px",
                  height: i.second === context.selection.content ? "18px" : "20px",
                  background: i.dust ? "blue" : "white",
                  borderLeft: context.selection.content && (i.main === context.selection.content) ? "1px solid" : "",
                  borderRight: context.selection.content && (i.main === context.selection.content) ? "1px solid" : "",
                  borderTop: context.selection.content && (i.second === context.selection.content) ? "1px solid" : "",
                  borderBottom: context.selection.content && (i.second === context.selection.content) ? "1px solid" : "",
                }
              }
              )})(),
              () => {
                if (!context.selection.relation) return [];
                const main = treeLeafs(context.selection.relation.mainTree.tree);
                return (
                  main.map(m => ({
                    main: m.data,
                    second: i.node.data,
                    dust: context.selection.relation!.table.find(cell => cell.main === m.data && cell.second === i.node.data)
                  }))
                );
              }
            )
          ),
          () => {
            if (!context.selection.relation) return [];
            return treeLeafs(context.selection.relation.secondTree.tree).map(tn => ({node: tn}))
          }
        ))
      )
    )
  )
}

let isHolderOpened = false;

context.tabs.push(context.selection);

export function UniverseSelector(){
  return (
    div({inlineStyle:{width: "33.3%"}})([
      div({onclick: () => context.selection.universe = context.data.systemUniverse})("System"),
      div({onclick: () => context.selection.universe = context.data.independentUniverse})("Independent"),
      hr()(),
      div()(
        Repeat(
          i => div({onclick: () => context.selection.universe = i.universe})(() => i.universe.name),
          () => context.data.universes.map(u => ({universe: u}))
        )
      )
    ])
  )
}
export function NebulaSelectorSingle(info:{nebula:Nebula}){
  return (
    div({inlineStyle: {display: "flex"}})([
      div({onclick: () => context.selection.nebula = info.nebula})(() => info.nebula.name),
      div({inlineStyle: {background: 'yellowgreen', borderRadius: "5px", marginLeft: "10px", fontSize: "11px", width: "19.5px", display: "flex", justifyContent: "center", alignItems: "center"}})(check => {
        check.style.display = "none";
        if (!context.selection.universe) return "";
        const nebLoc = context.selection.universe.nebulaLocations.find(nl => nl.nebula === info.nebula);
        if (!nebLoc) return "";
        if (nebLoc.start.eq(H(-1, 0, 0))) return "";
        
        check.style.display = "flex"
        return "✔";
      })
    ])
  )
}
export function RelationSelectorSingle(info:{relation:Relation}){
  return (
    div({onclick: () => context.selection.relation = info.relation})(
      () => `${info.relation.mainTree.name} - ${info.relation.secondTree.name}`
    )
  )
}
export function NebulaSelector(){
  let mode = "nebula" as "nebula" | "relation"
  return (
    div({inlineStyle:{width: "33.3%"}})(either([{
      if: () => true,
      then: div()([
        btn({onclick: () => mode = 'nebula'})("Nebula"),
        btn({onclick: () => mode = 'relation'})("Relation")
      ])
    }, {
      if: () => mode === "nebula",
      then: div()(
        Repeat(
          NebulaSelectorSingle,
          () => context.selection.universe?.nebulaLocations.map(nl => ({nebula: nl.nebula})) ?? []
        )
      )
    }, {
      if: () => mode === "relation",
      then: div()(
        Repeat(
          RelationSelectorSingle,
          () => context.selection.universe?.relations.map(r => ({relation: r})) ?? []
        )
      )
    }]))
  )
}

export function Breadcrumb(){
  function onHomeClick(){
    context.selection.content = undefined;
    context.selection.nebula = undefined;
    context.selection.universe = undefined;
  }
  return (
    div({ class: "breadcrumb" })(
      span({ class: "home material-symbols-outlined", onclick: onHomeClick })("home"),
      div({
        inlineStyle: U(() => ({
          display: context.selection.universe ? "" : "none",
          margin: "0 0.2rem"
        }))
      })(">"),
      div({
        onclick: () => {
          context.selection.content = undefined;
          context.selection.nebula = undefined;
        },
        inlineStyle: U(() => ({display: context.selection.universe ? "" : "none"}))
      })(() => context.selection.universe?.name ?? ""),
      div({inlineStyle: U(() => ({display: context.selection.nebula ? "" : "none", margin: "0 0.2rem"}))})(">"),
      div({
        onclick: () => context.selection.content = undefined,
        inlineStyle: U(() => ({display: context.selection.nebula ? "" : "none", margin: "0 0.2rem"}))
      })(() => context.selection.nebula?.name ?? ""),
      div({inlineStyle: U(() => ({display: context.selection.content ? "" : "none", margin: "0 0.2rem"}))})(">"),
      div({inlineStyle: {overflowX: "hidden", textOverflow: "ellipsis", textWrap: "nowrap"} as any})(() => context.selection.content?.title ?? ""),
    )
  )
}

export function SearchBar(){
  return (
    div({ class: "search-bar" })(
      span({ class: "material-symbols-outlined" })("search"),
      inputText({inlineStyle: {flexGrow: "1"}})()
    )
  )
}

body(
  div({ class: "top-left" })(
    RelationCreator()
  ),
  div({ class: "top-right" })(
    TabWrapper(),
    StaticToolBox()
  ),  
  div({ class: "left-side" })(
    SearchBar(),
    Breadcrumb(),
    div({ class: "carousel" })(
      div({
        class: "row",
        inlineStyle: U(() => ({
          left: context.selection.universe ? context.selection.nebula ? "-200%" : "-100%" : "0"
        }))
      })(
        UniverseSelector(),
        NebulaSelector(),
        div({inlineStyle:{width: "33.3%"}})([NestingList()])
      )
    )
  ),
  div({class: "main-view"})(either([{
      if: () => {
        if (!context.selection.relation) return;
        if (context.selection.content) return context.screenSplit;
        return true;
      },
      then: RelationView()
    },{
      if: () => {
        if (context.selection.relation) return false;
        if (context.selection.content) return context.screenSplit;
        return true;
      },
      then: NebulaPage(),
    },{
      if: () => context.selection.content,
      then: ContentEditor()
    }
  ])),
);