import { div, li, span, ul } from "@/funcObject";
import { Content } from "../../data/Data";
import { UIManager } from "@/objects/UIManager";
import { TreeNode } from "@/data-structure/tree";
import { engine } from "@/engine";


export function StarTreeNode(info:{node:TreeNode<Content>, selectedNode:()=>TreeNode<Content>|undefined, collapsed?:boolean}):HTMLLIElement{
  let pairs = info.node.children.map(cn => ({
    content: cn.data,
    element: StarTreeNode({node: cn, selectedNode: info.selectedNode}) 
  }))

  function updatePairs(){
    pairs = info.node.children.map(cn => ({
      content: cn.data,
      element: StarTreeNode({node: cn, selectedNode: info.selectedNode})
    }))
  }

  engine.updater.register(() => {
    if (info.node.children.length !== pairs.length) return updatePairs()
    for (let i = 0; i < pairs.length; i++){
      if (info.node.children[i].data !== pairs[i].content){
        return updatePairs()
      }
    }
  })

  return li({}, {className: () => info.selectedNode() === info.node ? "selected" : ""})([
    div()(() => info.node.data.title),
    ul()(
      () => pairs.map(p => p.element)
    )
  ])
}