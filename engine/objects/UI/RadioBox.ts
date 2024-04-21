import { div } from "@/funcObject";
import "../../styles/RadioBox.css"

export const radioBox = (...children:HTMLInputElement[]) => {
  if (children.some(c => c.type !== "radio")) throw "Only radio can be child";

  return div({class: "radio-box"})(...children)
}