import { li, ul } from "@/funcObject";
import { Content, Nebula } from "../../../data/Data";
import { UIManager } from "@/objects/UIManager";
import { StarTreeNode } from "./StarTreeNode";
import { Tree, TreeNode } from "@/data-structure/tree";
import { engine } from "@/engine";

export function TreeList<T>(info:{root:TreeNode<T>, itemChildrenBuilder: (data:T) => HTMLLIElement[]}){
  return ul()(
    info.root.children.map(
      c => li()([
        ...info.itemChildrenBuilder(c.data),
        TreeList<T>({root: c, itemChildrenBuilder: info.itemChildrenBuilder})
      ])
    )
  )
}
export function StarTreeList(info:{selectedNode?:HTMLLIElement}, selection: {nebula?: Nebula}) {
  if (!selection.nebula) return ul()()

  let nodePairs: {element: HTMLLIElement, content: Content}[] = [];

  const tree = selection.nebula?.tree.map(c => ({
    content: c,
    element: StarTreeNode(c),
    info: {
      childrenData: [] as Content[]
    }
  }));
  const nodes = new Array<HTMLLIElement>()

  engine.updater.register(() => {
    nodes.splice(0, nodes.length);
    nodes.push(...tree.root.children.map(c => c.data.element))
  })

  function insert(...contents: Content[]) {
    const AddingNodePairs = contents.map(c => ({
      element: StarTreeNode(c),
      content: c
    }));

    nodePairs.push(...AddingNodePairs);
    nodes.push(...AddingNodePairs.map(p => p.element));
  }

  function updent() {
    const left = info.selectedNode?.previousElementSibling;

    left?.insertAdjacentElement('beforebegin', info.selectedNode!);
  }
  function downdent() {
    const right = info.selectedNode?.nextElementSibling;

    right?.insertAdjacentElement('afterend', info.selectedNode!);
  }
  function outdent() {
    const parent = info.selectedNode?.parentElement?.parentElement;

    parent?.insertAdjacentElement('afterend', info.selectedNode!);
  }
  function indent() {
    const left = info.selectedNode?.previousElementSibling;
    const leftList = nodePairs.find(n => n.element === left)?.layout.list;

    leftList?.append(info.selectedNode!);
  }

  function init() {
    if (!selection.nebula) return;
    nodePairs.splice(0, nodePairs.length);
    nodePairs.push(...tree.nodes.map(n => n.data));
    tree.tourNode(tree.root, n => {
      n.data.info.childrenData = n.children.map(c => c.data.content);
    });
  }

  return ul()(nodes)
}
