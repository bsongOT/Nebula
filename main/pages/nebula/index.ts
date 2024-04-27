import { CanvasObject} from "@/objects/CanvasObject"
import { div, inputText, li, span, ul } from "@/funcObject"
import { Content, Nebula, data } from "../../data/Data"
import { UIManager } from "@/objects/UIManager"
import { DataCollection } from "../../data/DataCollection"

export class StarTreeNode {
  public readonly element:HTMLLIElement;
  public readonly layout:{
    main: HTMLDivElement,
    list: HTMLUListElement
  }
  constructor(content:Content){
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
  constructor(attrs:{nebula: Nebula}){
    super();
    this.info = attrs;
    this.layout = {

    }
    this.element = ul()(

    )
    this.init();
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
