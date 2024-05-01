import { btn, div, inputText, li, span, textarea, ul } from "@/funcObject";
import { Content, Nebula } from "../../data/Data";
import { UIManager } from "@/objects/UIManager";
import { hangulSeperate } from "@/utils/utils";
import { DataCollection } from "../../data/DataCollection";
import "./NebulaPalette.css"
import { NebulaPaletteInput } from "./NebulaPaletteInput";

function autoCompleteItem(content:Content){
  const item = li({onclick: ()=>item.classList.add("selected")})(span()(content.title));

  return item;
}
export class AutoComplete {
  private pairs:{
    element: HTMLLIElement,
    content: Content
  }[]

  public readonly palette;

  constructor(palette:NebulaPalette){
    this.palette = palette;
    this.pairs = [];
  }

  public handleKey(e:KeyboardEvent, autoComplete:HTMLUListElement) {
    const key = e.code.toLowerCase();

    if (key.includes("down")) return this.moveDown(autoComplete)
    if (key.includes("up")) return this.moveUp(autoComplete)
    if (key.includes("enter")) return this.complete(autoComplete)
  }

  public show(autoComplete:HTMLUListElement, contents:Content[]){
    autoComplete.innerHTML = "";
    this.pairs = [];

    autoComplete.classList.remove("hidden")

    const filteredContents = contents.filter(this.testContent);
    const pickedContents = filteredContents.slice(0, 25);

    this.pairs.push(
      ...pickedContents.map(c => ({
        element: autoCompleteItem(c),
        content: c
      }))
    )

    autoComplete.append(...this.pairs.map(p => p.element));
  }

  private testContent(content: Content) {
    const title = hangulSeperate(content.title);
    const input = hangulSeperate("");

    return title.includes(input);
  }

  private moveDown(autoComplete:HTMLUListElement){
    const selecteds = autoComplete.querySelector(".selected");
    const next = selecteds?.nextElementSibling ?? autoComplete.firstElementChild;

    selecteds?.classList.remove("selected")
    next?.classList.add("selected")
  }

  private moveUp(autoComplete:HTMLUListElement){
    const selecteds = autoComplete.querySelector(".selected");
    const prev = selecteds?.previousElementSibling ?? autoComplete.lastElementChild;

    selecteds?.classList.remove("selected")
    prev?.classList.add("selected");
  }

  private complete(autoComplete:HTMLUListElement){
    const selecteds = autoComplete.querySelector(".selected");
    const selectedContent = this.pairs.find(p => p.element === selecteds)?.content
    const text = this.palette.layout.input.text;
    const chars = text.value.split("")
    const lineStart = chars.findIndex((c, i) => c === "\n" && i >= text.selectionStart)
    const lineEnd = chars.findIndex((c, i) => c === "\n" && i <= text.selectionEnd)
    
    autoComplete.classList.add("hidden")

    if (!selectedContent) return;

    text.value = 
      text.value.slice(0, lineStart) +
      selectedContent.title  +
      text.value.slice(lineEnd, text.value.length)

    text.selectionStart = lineStart + selectedContent.title.length
  }
}
type PalettePair = {
  element: HTMLLIElement,
  content: Content,
  killed: boolean
}
export class NebulaPalette extends UIManager {
  public readonly layout;
  public readonly info;
  public readonly element;
  public readonly features;

  public readonly data;
  public readonly selection;

  public palettePairs;

  constructor(data: { contents: DataCollection<Content> }, selection: { nebula?:Nebula }) {
    super();
    this.palettePairs = new Array<PalettePair>()
    this.data = data;
    this.selection = selection;

    this.info = {
      selectedContents: new Array<Content>()
    }
    this.layout = {
      list: ul({class: "palette-list"})(),
      input: {
        container: div()(),
        text: textarea()(""),
        submitButton: btn()("")
      },
      autoComplete: ul({class: "auto-complete", onkeydown: (e:KeyboardEvent) => {
        this.features.autoComplete.handleKey(e, this.layout.autoComplete)
      }})()
    };
    this.element = div({class: "nebula-palette"})(
      div()(
        btn({onclick: () => this.startInput()})("setting")
      ),
      this.layout.list,
    );
    this.features = {
      input: new NebulaPaletteInput(this),
      autoComplete: new AutoComplete(this)
    }
    this.init();
  }

  public init(){
    this.layout.input.container.append(
      this.layout.input.text,
      this.layout.input.submitButton
    )
    super.init()
  }
  public kill(){
    const selectedElements = this.info.selectedContents.map(c => this.palettePairs.find(p => p.content === c)!.element).filter(e => e);
    const deathThreshold = this.palettePairs.find(p => p.element.classList.contains("dead"))?.element;

    if (deathThreshold){
      deathThreshold.before(...selectedElements)
    }
    else {
      for(const elt of selectedElements)
        this.layout.list.insertAdjacentElement("beforeend", elt)
    }
  }

  public readonly startInput = () => this.features.input.startInput();
  public readonly completeInput = () => {
    if (!this.selection.nebula) return;

    this.layout.input.container.classList.add("hidden")

    const contents = this.data.contents.all();
    const titles = [...new Set(this.layout.input.text.value.split("\n").map(v => v.trim()).filter(v => v !== ""))];
  
    this.palettePairs = [];

    const getContentByTitle = (title:string) => {
      const content = contents.find(c => c.title === title);
      if (content) return content;
      
      const newContent = new Content({title});
      
      return this.data.contents.add(newContent);
    }

    for (const title of titles){
      const content = getContentByTitle(title)
      const element = li({onclick: () => {
        element.classList.add("selected")
        this.info.selectedContents = this.palettePairs.filter(p => p.element.classList.contains("selected")).map(p => p.content)
      }})(span()(title))
      
      this.palettePairs.push({
        element: element,
        content: content,
        killed: this.selection.nebula.tree.nodes.map(n => n.data).includes(content)
      })
    }

    this.layout.list.innerHTML = "";
    this.layout.list.append(
      ...this.palettePairs.sort((a, b) => (a.killed ? 0 : 1) - (b.killed ? 0 : 1)).map(p => p.element)
    )
  }

  public showAutoComplete() {
    this.layout.autoComplete.style.top = "0";
  }

  public update() {}
  public detect() { return false; }
}
