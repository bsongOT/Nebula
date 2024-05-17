import { li, span } from "@/funcObject";
import { Content, Nebula } from "../../../data/Data";
import { NebulaPalette } from "./NebulaPalette";

export class NebulaPaletteInput {
  constructor(public palette:NebulaPalette){}

  public startInput(){
    const {selection, info} = this.palette;
    if (!selection.nebula) return;
    info.isInputMode = true;
  }
  public completeInput(input:string){
    const {selection, data, info} = this.palette;
    if (!selection.nebula) return;
    info.isInputMode = false;
    
    const titles = this.toTitles(input)
    const contents = titles.map(title => Content.request(data.contents, {title}))
    const attrs:Partial<HTMLElement> = {
      onclick: e => (<HTMLElement>e.target).classList.add("selected")
    }

    this.palette.pairs = contents.map(c =>({
      element: li(attrs)(c.title),
      content: c,
      killed: selection.nebula?.tree.nodes.map(n => n.data).includes(c) ?? false
    }))
    .sort((a, b) => (a.killed ? 0 : 1) - (b.killed ? 0 : 1))
    
    this.palette.layout.list.innerHTML = "";
    this.palette.layout.list.append(
      ...this.palette.pairs.map(p => p.element)
    )
  }
  private toTitles(input:string){
    return [
      ...new Set(
        input.split("\n")
          .map(v => v.trim())
          .filter(v => v !== "")
      )
    ]
  }
  private toPairs(contents:Content[]){
    const {selection} = this.palette;
    const attrs:Partial<HTMLElement> = {
      onclick: e => (<HTMLElement>e.target).classList.add("selected")
    }
    return contents
      .map(c => ({
        element: li()(),
        content: c,
        killed: selection.nebula?.tree.nodes.map(n => n.data).includes(c) ?? false
      }))
      .sort((a, b) => 
        (a.killed ? 0 : 1) - (b.killed ? 0 : 1)
      )
  }
}