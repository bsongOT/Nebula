import { Content } from "../../../data/Data";
import { hangulSeperate } from "@/utils/utils";
import { NebulaPalette } from "./NebulaPalette";
import { li, span, ul } from "@/funcObject";
import { U } from "@/engine";

export function AutoComplete(info:{search:string}) {
  let pairs: {
    element: HTMLLIElement;
    content: Content;
  }[] = [];
  let isShown = false;
  let selectedContent:Content|undefined;

  function handleKey(e: KeyboardEvent) {
    const key = e.code.toLowerCase();

    if (key.includes("down")) return moveDown();
    if (key.includes("up")) return moveUp();
    if (key.includes("enter")) return complete(<HTMLTextAreaElement>e.target);
  }

  function show(contents: Content[]) {
    isShown = true;

    const filteredContents = contents.filter(c => testContent(c, info.search));
    const pickedContents = filteredContents.slice(0, 25);

    pairs = pickedContents.map(c => ({
      element: li({
        onclick: e => (<HTMLElement>e.target).classList.add("selected"),
        className: U(() => selectedContent === c ? "selected" : "")
      })(c.title),
      content: c
    }));
  }

  function testContent(content: Content, search:string) {
    const title = hangulSeperate(content.title);
    const input = hangulSeperate(search);

    return title.includes(input);
  }

  function moveDown() {
    const selectedElement = pairs.find(p => p.content === selectedContent)?.element;
    const next = selectedElement?.nextElementSibling ?? pairs[0].element;

    selectedContent = pairs.find(p => p.element === next)?.content;
  }

  function moveUp() {
    const selectedElement = pairs.find(p => p.content === selectedContent)?.element;
    const prev = selectedElement?.previousElementSibling ?? pairs.at(-1)?.element;

    selectedContent = pairs.find(p => p.element === prev)?.content;
  }

  function complete(text:HTMLTextAreaElement) {
    const chars = text.value.split("");
    const lineStart = chars.findIndex((c, i) => c === "\n" && i >= text.selectionStart);
    const lineEnd = chars.findIndex((c, i) => c === "\n" && i <= text.selectionEnd);

    isShown = false;

    if (!selectedContent) return;

    text.value =
      text.value.slice(0, lineStart) +
      selectedContent.title +
      text.value.slice(lineEnd, text.value.length);

    text.selectionStart = lineStart + selectedContent.title.length;
  }

  return (
    ul({
      class: "auto-complete",
      onkeydown: handleKey,
      className: U(() => isShown ? "" : "hidden")
    })(
      () => pairs.map(p => p.element)
    )
  )
}