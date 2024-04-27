import { inputText, li, span, textarea, ul } from "@/funcObject";
import { Content, Nebula } from "../../data/Data";
import { UIManager } from "@/objects/UIManager";
import { hangulSeperate } from "@/utils/utils";
import { DataCollection } from "../../data/DataCollection";

function autoCompleteItem(content:Content){
  const item = li({onclick: ()=>item.classList.add("selected")})(span()(content.title));

  return item;
}
export class AutoComplete extends UIManager {
  public readonly layout;
  public readonly info;
  public readonly element;
  private pairs:{
    element: HTMLLIElement,
    content: Content
  }[]

  constructor(attrs:{search: string, contents: DataCollection<Content>, onComplete: (content:Content) => void}){
    this.info = attrs;
    this.layout = {}
    this.element = ul({class: "auto-complete", onkeydown: (e:KeyboardEvent) => this.handleKey(e)})()
    this.pairs = [];
    this.init()
  }

  private handleKey(e:KeyboardEvent) {
    const key = e.code.toLowerCase();

    if (key.includes("down")) return this.moveDown()
    if (key.includes("up")) return this.moveUp()
    if (key.includes("enter")) return this.complete()
  }

  public show(){
    this.element.innerHTML = "";
    this.layout.pairs = [];

    const contents = this.info.contents.all();
    const filteredContents = contents.filter(this.testContent);
    const pickedContents = filteredContents.slice(0, 25);

    this.pairs.push(
      ...pickedContents.map(c => ({
        element: autoCompleteItem(c),
        content: c
      }))
    )

    this.element.append(...this.pairs.map(p => p.element));
  }

  private testContent(content: Content) {
    const title = hangulSeperate(content.title);
    const input = hangulSeperate(this.info.search);

    return title.includes(input);
  }

  private moveDown(){
    const selecteds = this.element.querySelector(".selected");
    if (!selecteds) return;

    selecteds.classList.remove("selected");
    
    const next = selecteds.nextElementSibling;

    if (next){
      next.classList.add("selected");
    }
    else {
      const first = this.element.firstElementChild
      if (!first) return;
      
      first.classList.add("selected")
    }
    
    return;
  }

  private moveUp(){
    const selecteds = this.element.querySelector(".selected");
    if (!selecteds) return;

    selecteds.classList.remove("selected");
    
    const prev = selecteds.previousElementSibling;

    if (prev){
      prev.classList.add("selected");
    }
    else {
      const last = this.element.lastElementChild
      if (!last) return;
      
      last.classList.add("selected")
    }
    
    return;
  }

  private complete(){
    const selecteds = this.element.querySelector(".selected");
    if (!selecteds) return;

    const selectedContent = this.pairs.find(p => p.element === selecteds)
    this.info.onComplete(selectedContent);
  }
}
export class NebulaPalette extends UIManager {
  public readonly layout;
  public readonly info;
  public readonly element;

  constructor(attributes: { nebula: Nebula; }) {
    super();
    this.info = attributes;
    this.layout = {
      autoComplete: new AutoComplete({contents: this.info.contents, onComplete: content => this.complete(content)}),
      text: textarea()()
    };
    this.element = div({class: "nebula-palette hidden"})(
      this.layout.text
    );
    this.init();
  }

  public complete(content:Content){
    //TODO
  }

  public showAutoComplete() {
    this.layout.autoComplete.element.style.top = "0";
    this.layout.autoComplete.show();
  }

  public init(){
    this.layout.text.innerText = this.info.nebula.palette.map(c => c.title).join("\n");
    super.init();
  }
  public update() {}
  public detect() { return false; }
}
