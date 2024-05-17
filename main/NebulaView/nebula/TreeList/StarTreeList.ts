import { ul } from "@/funcObject";
import { Content, Nebula } from "../../../data/Data";
import { UIManager } from "@/objects/UIManager";
import { StarTreeNode } from "./StarTreeNode";
import { Tree } from "@/data-structure/tree";

export function TreeList<T>(info:{tree:Tree<T>}){

}
export function StarTreeList(info:{selectedNode?:HTMLLIElement}, selection: {nebula?: Nebula}) {
  let nodePairs: {
    element: HTMLLIElement,
    content: Content
  }[] = [];

  function insert(...contents: Content[]) {
    const nodes = contents.map(c => StarTreeNode(c));

    nodePairs.push(...nodes);
    element.append(...nodes.map(n => n));
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
    const tree = selection.nebula.tree.map(c => StarTreeNode(c));
    nodePairs = tree.nodes.map(n => n.data);
    tree.tourNode(tree.root, n => {
      n.data.layout.list.append(
        ...n.children.map(c => c.data)
      );
    });
    element.append(
      ...tree.root.children.map(c => c.data));
  }
}
