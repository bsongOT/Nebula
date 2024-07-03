import { div } from "@/funcObject";
import "../../styles/RadioBox.css"

export function RadioBox(info:{direction?:"row"|"column", children: HTMLElement[]}) {
  const className = () => `radio-box ${(info.direction ?? "row")}`.trim()
  return div({}, {className})(info.children)
}