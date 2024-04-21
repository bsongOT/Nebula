import { CanvasObject, Container, Hexagon} from "@/objects/CanvasObject"
import { StarTile } from "../../custom-object"
import {H, P} from "@/utils/math/coord-system"
import { btn, canvas, div, li, span, ul } from "@/funcObject"
import { Content, Nebula } from "../../data/Data"
import { UIManager } from "@/objects/UIManager"
import { gridify } from "@/data-structure/utils"
import { selli } from "@/objects/UI/list/selli"

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
  constructor(attrs:{}){
    super();
    this.info = attrs;
    this.layout = {

    }
    this.element = ul()(

    )
  }
  public update(){
  }
  public detect(){
    return false;
  }
}
export class StarTree extends UIManager {
  public readonly layout;
  public readonly info;
  public readonly element;

  public paletteGroups:{
    content:Content,
    element:HTMLLIElement
  }[]

  public selection:{
    element:HTMLElement
  }|undefined;

  constructor(attributes:{nebula: Nebula}){
    super()
    this.info = attributes;
    this.paletteGroups = [];
    this.layout = {
      tree: ul()(),
      palette: {
        list: ul()(),
      },
      contentSelector: div()(),
      nebulaGrid: {
        tileBox: new Container(),
        effectBox: new Container()
      }
    }
    this.element = div()(
      div()(
        this.layout.palette.list,
        btn({class: "adder", onclick: ()=>this.addIntoPalette()})("+"),
        btn({class: "remover", onclick: ()=>this.removeFromPalette()})("-")
      ),
      this.layout.contentSelector,
      btn({class: "bringer"})("->"),
      this.layout.tree,
      div({class: "arrow-keys"})(
        btn({class: "up-arrow", onclick: ()=>this.updent()})("위"),
        btn({class: "left-arrow", onclick: ()=>this.outdent()})("왼"),
        btn({class: "down-arrow", onclick: ()=>this.downdent()})("밑"),
        btn({class: "right-arrow", onclick: ()=>this.indent()})("오")
      ),
      canvas()(
        this.layout.nebulaGrid.tileBox,
        this.layout.nebulaGrid.effectBox
      )
    )
    this.init()
  }
  public init(){
    const tree = this.info.nebula.tree.map(c => new StarTreeNode(c));
    tree.tourNode(tree.root, node => {
      node.data.layout.list.append(
        ...node.children.map(n => n.data.element)
      )
    })
    this.layout.tree.append(...tree.root.children.map(n => n.data.element))
    this.layout.palette.list.append(...this.info.nebula.palette.map(c => selli()(span()(c.title))))
    super.init()
  }
  public detect(){ return true; }
  public update(){
    this.layout.nebulaGrid.tileBox.empty()

    const tileBox = this.layout.nebulaGrid.tileBox;
    const canvasSize = 500;//this.layout.nebulaGrid.canvas.scrollWidth;
    const canvasCenter = P(1,1).scale(canvasSize / 2)
    const grid = gridify(this.info.nebula.tree)
    const size = grid.size.x;
    const pivot = H(size - 1, 0, size - 1)

    for (const pos of grid.range){
      const content = grid.at(pos);
      const tile = content ? new StarTile("none", content) : new Hexagon()
      const coord = pos.sub(pivot).toCoord(20).add(canvasCenter)

      tile.position = coord;
      tile.side = 20;

      tileBox.adopt(tile)
    }
  }
  public updent(){
    const left = this.selection?.element?.previousElementSibling;
    if (!left) return;

    left.insertAdjacentElement('beforebegin', this.selection!.element)
  }
  public downdent(){
    const right = this.selection?.element?.nextElementSibling;
    if (!right) return;

    right.insertAdjacentElement('afterend', this.selection!.element)
  }
  public outdent(){
    const parent = this.selection?.element?.parentElement;
    if (!parent) return;

    parent.insertAdjacentElement('afterend', this.selection!.element)
  }
  public indent(){
    const left = this.selection?.element?.previousElementSibling;
    if (!left) return;

    left.append(this.selection!.element)
  }

  public addIntoPalette(){
    this.layout.contentSelector.style.display = "block";
  }

  public removeFromPalette(){
    this.layout.palette.list.querySelector(".selected")?.remove()
  }
  
  public putIntoNebula(){
    const item = this.layout.palette.list.querySelector(".selected")
    const content = this.paletteGroups.find(g => g.element === item)?.content
    if (!content) return;
    this.layout.tree.append(new StarTreeNode(content).element)
    item?.remove()
  }
}