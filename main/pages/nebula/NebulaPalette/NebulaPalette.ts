import { btn, div, inputText, li, span, textarea, ul } from "@/funcObject";
import { Content, Nebula } from "../../../data/Data";
import { UIManager } from "@/objects/UIManager";
import { DataCollection } from "../../../data/DataCollection";
import "./NebulaPalette.css"
import { NebulaPaletteInput } from "./NebulaPaletteInput";
import { AutoComplete } from "./AutoComplete";

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

  public palettePairs;

  constructor(data: { contents: DataCollection<Content> }, selection: { nebula?:Nebula }) {
    super();
    this.palettePairs = new Array<PalettePair>()
    this.data = data;
    this.selection = selection;

    this.info = {
      selectedContents: new Array<Content>()
    }
    this.memento = {
      list: {
        class: "palette-list"
      },
      autoComplete: {
        class: "auto-complete",
        onkeydown: (e:KeyboardEvent) => {
          this.features.autoComplete.handleKey(e, this.layout.autoComplete);
        }
      }
    }
    this.layout = {
      list: ul(this.memento.list)(),
      input: {
        container: div()(),
        text: textarea()(""),
        submitButton: btn()("")
      },
      autoComplete: ul(this.memento.autoComplete)()
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
  public readonly completeInput = () => this.features.input.completeInput();

  public readonly showAutoComplete = () => this.features.autoComplete.show(this.layout.autoComplete, this.data.contents.all());

  public init(){
    this.layout.input.container.append(
      this.layout.input.text,
      this.layout.input.submitButton
    )
    super.init()
  }
  public update() {}
  public detect() { return false; }
}
