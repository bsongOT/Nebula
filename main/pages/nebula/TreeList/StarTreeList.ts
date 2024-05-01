import { ul } from "@/funcObject";
import { Content, Nebula } from "../../../data/Data";
import { UIManager } from "@/objects/UIManager";
import { StarTreeNode } from "./StarTreeNode";

export class StarTreeList extends UIManager {
  public readonly element;
  public readonly info;
  public readonly layout;
  public readonly selection;

  private nodePairs: StarTreeNode[];
  public selectedNode: StarTreeNode | undefined;

  constructor(selection: { nebula?: Nebula; }) {
    super();
    this.info = {};
    this.selection = selection;
    this.layout = {};
    this.element = ul()();
    this.nodePairs = [];
    this.init();
  }

  public insert(...contents: Content[]) {
    const nodes = contents.map(c => new StarTreeNode(c));

    this.nodePairs.push(...nodes);
    this.element.append(...nodes.map(n => n.element));
  }

  public updent() {
    const left = this.selectedNode?.element?.previousElementSibling;
    if (!left) return;

    left.insertAdjacentElement('beforebegin', this.selectedNode!.element);
  }
  public downdent() {
    const right = this.selectedNode?.element?.nextElementSibling;
    if (!right) return;

    right.insertAdjacentElement('afterend', this.selectedNode!.element);
  }
  public outdent() {
    const parent = this.selectedNode?.element?.parentElement?.parentElement;

    if (!parent) return;

    parent.insertAdjacentElement('afterend', this.selectedNode!.element);
  }
  public indent() {
    const left = this.selectedNode?.element?.previousElementSibling;
    const leftList = this.nodePairs.find(n => n.element === left)?.layout?.list;

    if (!leftList) return;

    leftList.append(this.selectedNode!.element);
  }

  public init() {
    if (!this.selection.nebula) return;
    const tree = this.selection.nebula.tree.map(c => new StarTreeNode(c));
    this.nodePairs = tree.nodes.map(n => n.data);
    tree.tourNode(tree.root, n => {
      n.data.layout.list.append(
        ...n.children.map(c => c.data.element)
      );
    });
    this.element.append(
      ...tree.root.children.map(c => c.data.element));
    super.init();
  }
  public update() { }
  public detect() { return false; }
}
