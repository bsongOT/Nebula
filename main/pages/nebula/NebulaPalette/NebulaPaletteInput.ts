import { li, span } from "@/funcObject";
import { Content, Nebula } from "../../../data/Data";
import { NebulaPalette } from "./NebulaPalette";

export class NebulaPaletteInput {
    constructor(public palette:NebulaPalette){}

    public startInput(){
        const pl = this.palette;
        if (!pl.selection.nebula) return;
        pl.layout.input.container.classList.remove("hidden")
        pl.layout.input.text.value = pl.palettePairs.map(p => p.content.title).join("\n")
    }
    public completeInput(){
        const {selection, layout, data} = this.palette;
        if (!selection.nebula) return;

        layout.input.container.classList.add("hidden")
    
        const titles = [...new Set(layout.input.text.value.split("\n").map(v => v.trim()).filter(v => v !== ""))];
      
        this.palette.palettePairs = [];
    
        const getContentByTitle = (title:string) => {
          const content = data.contents.all().find(c => c.title === title);
          if (content) return content;
          
          const newContent = new Content({title});
          
          return data.contents.add(newContent);
        }
    
        for (const title of titles){
          const content = getContentByTitle(title)
          const element = li({onclick: () => {
            element.classList.add("selected")
            this.palette.info.selectedContents = this.palette.palettePairs.filter(p => p.element.classList.contains("selected")).map(p => p.content)
          }})(span()(title))
          
          this.palette.palettePairs.push({
            element: element,
            content: content,
            killed: selection.nebula.tree.nodes.map(n => n.data).includes(content)
          })
        }
    
        this.palette.layout.list.innerHTML = "";
        this.palette.layout.list.append(
          ...this.palette.palettePairs.sort((a, b) => (a.killed ? 0 : 1) - (b.killed ? 0 : 1)).map(p => p.element)
        )
    }
}