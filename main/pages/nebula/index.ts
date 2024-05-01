import { CanvasObject} from "@/objects/CanvasObject"
import { div, inputText, li, span, ul } from "@/funcObject"
import { Content, Nebula, data } from "../../data/Data"
import { UIManager } from "@/objects/UIManager"
import { DataCollection } from "../../data/DataCollection"
import { Tree } from "@/data-structure/tree"

export class StarTreeNode extends UIManager{
  public readonly element:HTMLLIElement;
  public readonly content:Content;
  public readonly info;
  public readonly layout

  constructor(content:Content){
    super();
    this.content = content;
    this.info = {}
    this.layout = {
      main: div()(span()(content.title)),
      list: ul()()
    }
    this.element = li()(
      this.layout.main,
      this.layout.list
    );
    this.init()
  }
  public update(){}
  public detect = () => false;
}
export class StarTreeList extends UIManager {
  public readonly element;
  public readonly info;
  public readonly layout;
  public readonly selection;

  private nodePairs:StarTreeNode[]
  public selectedNode: StarTreeNode | undefined;

  constructor(selection:{nebula?: Nebula}){
    super();
    this.info = {};
    this.selection = selection;
    this.layout = {}
    this.element = ul()()
    this.nodePairs = [];
    this.init();
  }

  public insert(content:Content){
    const node = new StarTreeNode(content);
    
    this.nodePairs.push(node);
    this.element.append(node.element);
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
    const leftList = this.nodePairs.find(n => n.element === left)?.layout?.list

    if (!leftList) return;

    leftList.append(this.selectedNode!.element);
  }

  public init(){
    if (!this.selection.nebula) return;
    const tree = this.selection.nebula.tree.map(c => new StarTreeNode(c))
    this.nodePairs = tree.nodes.map(n => n.data)
    tree.tourNode(tree.root, n => {
      n.data.layout.list.append(
        ...n.children.map(c => c.data.element)
      )
    })
    this.element.append(
      ...tree.root.children.map(c => c.data.element))
    super.init()
  }
  public update(){}
  public detect(){ return false; }
}
