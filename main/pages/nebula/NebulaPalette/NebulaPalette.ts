import { btn, div, inputText, li, span, textarea, ul } from "@/funcObject";
import { Content, Nebula } from "../../../data/Data";
import { UIManager } from "@/objects/UIManager";
import { DataCollection } from "../../../data/DataCollection";
import "./NebulaPalette.css"
import { NebulaPaletteInput } from "./NebulaPaletteInput";
import { AutoComplete } from "./AutoComplete";
import { u } from "@/objects/UIUpdater";

type PalettePair = {
  element: HTMLLIElement,
  content: Content,
  killed: boolean
}
export class NebulaPalette extends UIManager {
  public readonly layout;
  public readonly info;
  public readonly memento;
  public readonly element;
  public readonly features;

  public readonly data;
  public readonly selection;

  public pairs;
  private input:string;

  constructor(data: { contents: DataCollection<Content> }, selection: { nebula?:Nebula }) {
    super();
    this.pairs = new Array<PalettePair>()
    this.data = data;
    this.selection = selection;
    this.input = "";

    this.info = {
      isInputMode: false,
      selectedContents: new Array<Content>()
    }
    this.memento = {
      autoComplete: {
        class: "auto-complete",
        onkeydown: (e:KeyboardEvent) => {
          this.features.autoComplete.handleKey(e, this.layout.autoComplete);
        }
      }
    }
    this.layout = {
      list: ul({class: "palette-list"})(),
      input: {
        text: u(textarea({class: "palette-text", onchange: e=>this.input = (<HTMLTextAreaElement>e.target).value})(""))({value: (element) => {
          if (!this.info.isInputMode) return element.value;
          return this.pairs.map(p => p.content.title).join("\n")
        }})
      },
      autoComplete: ul(this.memento.autoComplete)()
    };
    this.element = div({class: "nebula-palette"})(
      div()(
        btn({onclick: () => this.startInput()})("setting")
      ),
      this.layout.list,
      u(div()(
        this.layout.input.text,
        btn({onclick: ()=>this.completeInput()})("submit")
        ))({
        className: () => this.info.isInputMode ? "palette-text-box" : "palette-text-box hidden"
      }),
    );
    this.features = {
      input: new NebulaPaletteInput(this),
      autoComplete: new AutoComplete(this)
    }
    this.init();
  }

  public kill(){
    const selectedElements = this.info.selectedContents.map(c => this.pairs.find(p => p.content === c)!.element).filter(e => e);
    const deathThreshold = this.pairs.find(p => p.element.classList.contains("dead"))?.element;

    if (deathThreshold){
      deathThreshold.before(...selectedElements)
    }
    else {
      for(const elt of selectedElements)
        this.layout.list.insertAdjacentElement("beforeend", elt)
    }
  }

  public readonly startInput = () => this.features.input.startInput();
  public readonly completeInput = () => this.features.input.completeInput(this.input);

  public readonly showAutoComplete = () => this.features.autoComplete.show(this.layout.autoComplete, this.data.contents.all());

  public update() {}
  public detect() { return false; }
}
