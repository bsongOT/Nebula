import { div } from "@/funcObject";
import "../../styles/RadioBox.css"
import { U } from "@/engine";

export function RadioBox(info:{direction?:"row"|"column", children: HTMLElement[]}) {
  const className = U(() => `radio-box ${(info.direction ?? "row")}`.trim())
  return div({className})(info.children)
}