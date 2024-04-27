import { inputText, li, span, ul } from "@/funcObject";
import { Nebula } from "../../data/Data";
import { UIManager } from "@/objects/UIManager";
import { hangulSeperate } from "@/utils/utils";

export class NebulaPalette extends UIManager {
  public readonly layout;
  public readonly info;
  public readonly element;

  constructor(attributes: { nebula: Nebula; }) {
    super();
    this.info = attributes;
    this.layout = {
      items: new Array<HTMLInputElement>(),
      autoComplete: ul({ 
        class: "auto-complete",
        onkeydown: (e:KeyboardEvent) => {
          
        }
      })()
    };
    this.element = ul({ class: "nebula-palette" })();
    this.init();
  }

  public showAutoComplete(item: HTMLInputElement) {
    item.after(this.layout.autoComplete);
    this.layout.autoComplete.innerHTML = "";
    this.layout.autoComplete.append(
      ...this.info.nebula.palette.filter(c => {
        const title = hangulSeperate(c.title);
        const input = hangulSeperate(item.value);

        return title.includes(input);
      }).map(c => li()(span()(c.title)))
    );
  }

  public update() {
    this.layout.items = this.info.nebula.palette.map(
      c => {
        const text = inputText({ 
          value: c.title, 
          oninput: () => this.showAutoComplete(text)
        })()
        return text;
      }
    )

    this.element.append(
      ...this.layout.items.map(
        item => li({
          onkeydown: (e:KeyboardEvent) => {
            if (e.code.toLowerCase().includes("enter")){

            }
          }
        })(item)
      )
    );
  }
  public detect() {
    return false;
  }
}
