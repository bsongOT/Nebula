import { div, li, span, ul } from "@/funcObject";
import { Content } from "../../../data/Data";
import { UIManager } from "@/objects/UIManager";


export function StarTreeNode(content: Content) {
  return li()([
    div()(content.title),
    ul()()
  ]);
}