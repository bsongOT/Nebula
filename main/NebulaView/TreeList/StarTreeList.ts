import { li, ul } from "@/funcObject";
import { CommonNebula, Content, Nebula } from "../../data/Data";
import { StarTreeNode } from "./StarTreeNode";
import { TreeNode } from "@/data-structure/tree";

export function TreeList<T>(info:{startNode:TreeNode<T>, itemChildrenBuilder: (data:T) => HTMLElement[]}):HTMLUListElement{
  return ul()(
    info.startNode.children.map(
      c => li()([
        ...info.itemChildrenBuilder(c.data),
        TreeList<T>({startNode: c, itemChildrenBuilder: info.itemChildrenBuilder})
      ])
    )
  )
}
export function StarTreeList(info:{selectedNode?:TreeNode<Content>, shownNebula: CommonNebula}) {
  return ul()(() => 
    info.shownNebula.tree.root.children.map(
      cn => StarTreeNode({node: cn, selectedNode:() => info.selectedNode}))
  )
}
