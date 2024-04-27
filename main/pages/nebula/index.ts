import { CanvasObject} from "@/objects/CanvasObject"
import { div, inputText, li, span, ul } from "@/funcObject"
import { Content, Nebula, data } from "../../data/Data"
import { UIManager } from "@/objects/UIManager"
import { DataCollection } from "../../data/DataCollection"
import { Tree } from "@/data-structure/tree"

export class StarTreeNode {
  public readonly element:HTMLLIElement;
  public readonly content:Content;
  public readonly layout:{
    main: HTMLDivElement,
    list: HTMLUListElement
  }
  constructor(content:Content){
    this.content = content;
    this.layout = {
      main: div()(span()(content.title)),
      list: ul()()
    }
    this.element = li()(
      this.layout.main,
      this.layout.list
    );
  }
}
export class StarTreeList extends UIManager {
  public readonly element;
  public readonly info;
  public readonly layout;

  public selection:StarTreeNode | undefined;

  constructor(attrs:{nebula: Nebula}){
    super();
    this.info = attrs;
    this.layout = {}
    this.element = ul()()
    this.init();
  }

  public updent() {
    const left = this.selection?.element?.previousElementSibling;
    if (!left) return;

    left.insertAdjacentElement('beforebegin', this.selection!.element);
  }
  public downdent() {
    const right = this.selection?.element?.nextElementSibling;
    if (!right) return;

    right.insertAdjacentElement('afterend', this.selection!.element);
  }
  public outdent() {
    const parent = this.selection?.element?.parentElement;
    if (!parent) return;

    parent.insertAdjacentElement('afterend', this.selection!.element);
  }
  public indent() {
    const left = this.selection?.element?.previousElementSibling;
    if (!left) return;

    left.append(this.selection!.element);
  }

  public init(){
    const tree = this.info.nebula.tree.map(c => new StarTreeNode(c))
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
