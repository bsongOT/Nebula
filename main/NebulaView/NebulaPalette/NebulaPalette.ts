import { btn, div, inputText, li, span, textarea, ul } from "@/funcObject";
import { CommonNebula, Content, Nebula } from "../../data/Data";
import { UIManager } from "@/objects/UIManager";
import { DataCollection } from "../../data/DataCollection";
import "./NebulaPalette.css"
import { AutoComplete } from "./AutoComplete";

type PalettePair = {
  element: HTMLLIElement,
  content: Content,
  killed: boolean
}
export function NebulaPalette(data: { contents: DataCollection<Content> }, info: { shownNebula:CommonNebula }) {
  let pairs = new Array<PalettePair>()
  let input = "";
  let isInputOpened = false;
  let selectedContents = new Array<Content>()

  function startInput(){
    isInputOpened = true;
  }
  function completeInput(){
    isInputOpened = false;
    
    const titles = toTitles(input)
    const contents = titles.map(title => Content.request(data.contents, {title}))

    pairs = toPairs(contents)
  }
  function toTitles(input:string){
    return [
      ...new Set(
        input.split("\n")
          .map(v => v.trim())
          .filter(v => v !== "")
      )
    ]
  }
  function toPairs(contents:Content[]){
    return contents
      .map(c => ({
        element: li(
          {onclick: () => selectedContents.push(c)}, 
          {className: () => `${selectedContents.includes(c) ? "selected" : ""} ${info.shownNebula.tree.nodes.map(n => n.data).includes(c) ? "dead" : ""}` })(),
        content: c,
        killed: info.shownNebula.tree.nodes.map(n => n.data).includes(c) ?? false
      }))
      .sort((a, b) => 
        (a.killed ? 0 : 1) - (b.killed ? 0 : 1)
      )
  }

  function kill(){
    pairs = pairs
      .sort((a, b) => 
        (a.killed ? 0 : 1) - (b.killed ? 0 : 1)
      )
  }

  return div({class: "nebula-palette"})([
    div()([
      btn({onclick: startInput})("setting")
    ]),
    ul({class: "palette-list"})(
      () => pairs.map(p => p.element)
    ),
    div({}, {className: () => isInputOpened ? "palette-text-box" : "palette-text-box hidden"})([
      textarea({
        class: "palette-text", 
        onchange: e=> input = (<HTMLTextAreaElement>e.target).value },{
        value: (element) => {
          if (!isInputOpened) return element.value;
          return pairs.map(p => p.content.title).join("\n")
        }
      })(),
      AutoComplete({search: ""}),
      btn({onclick: completeInput})("submit")
    ]),
  ]);
}