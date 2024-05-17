import { Content } from "../../../data/Data";
import { hangulSeperate } from "@/utils/utils";
import { NebulaPalette } from "./NebulaPalette";
import { li, span } from "@/funcObject";

export class AutoComplete {
  private pairs: {
    element: HTMLLIElement;
    content: Content;
  }[];

  public readonly palette;

  constructor(palette: NebulaPalette) {
    this.palette = palette;
    this.pairs = [];
  }

  public handleKey(e: KeyboardEvent, autoComplete: HTMLUListElement) {
    const key = e.code.toLowerCase();

    if (key.includes("down")) return this.moveDown(autoComplete);
    if (key.includes("up")) return this.moveUp(autoComplete);
    if (key.includes("enter")) return this.complete(autoComplete);
  }

  public show(autoComplete: HTMLUListElement, contents: Content[]) {
    autoComplete.innerHTML = "";

    autoComplete.classList.remove("hidden");

    const filteredContents = contents.filter(this.testContent);
    const pickedContents = filteredContents.slice(0, 25);

    this.pairs = pickedContents.map(c => ({
      element: li({
        onclick: e => (<HTMLElement>e.target).classList.add("selected")
      })(c.title),
      content: c
    }));

    autoComplete.append(...this.pairs.map(p => p.element));
  }

  private testContent(content: Content) {
    const title = hangulSeperate(content.title);
    const input = hangulSeperate(this.palette.layout.input.text.value);

    return title.includes(input);
  }

  private moveDown(autoComplete: HTMLUListElement) {
    const selecteds = autoComplete.querySelector(".selected");
    const next = selecteds?.nextElementSibling ?? autoComplete.firstElementChild;

    selecteds?.classList.remove("selected");
    next?.classList.add("selected");
  }

  private moveUp(autoComplete: HTMLUListElement) {
    const selecteds = autoComplete.querySelector(".selected");
    const prev = selecteds?.previousElementSibling ?? autoComplete.lastElementChild;

    selecteds?.classList.remove("selected");
    prev?.classList.add("selected");
  }

  private complete(autoComplete: HTMLUListElement) {
    const selecteds = autoComplete.querySelector(".selected");
    const selectedContent = this.pairs.find(p => p.element === selecteds)?.content;
    const text = this.palette.layout.input.text;
    const chars = text.value.split("");
    const lineStart = chars.findIndex((c, i) => c === "\n" && i >= text.selectionStart);
    const lineEnd = chars.findIndex((c, i) => c === "\n" && i <= text.selectionEnd);

    autoComplete.classList.add("hidden");

    if (!selectedContent) return;

    text.value =
      text.value.slice(0, lineStart) +
      selectedContent.title +
      text.value.slice(lineEnd, text.value.length);

    text.selectionStart = lineStart + selectedContent.title.length;
  }
}
