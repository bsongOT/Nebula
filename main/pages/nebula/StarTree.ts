import { Container, Hexagon } from "@/objects/CanvasObject";
import { StarTile } from "../../custom-object";
import { H, P } from "@/utils/math/coord-system";
import { btn, canvas, div, span, ul } from "@/funcObject";
import { Content, Nebula } from "../../data/Data";
import { UIManager } from "@/objects/UIManager";
import { gridify } from "@/data-structure/utils";
import { selli } from "@/objects/UI/list/selli";
import { NebulaPalette } from "./NebulaPalette";
import { StarTreeList, StarTreeNode } from ".";

export class NebulaModel extends UIManager {
  public readonly layout;
  public readonly info;
  public readonly element;

  constructor(attrs: {nebula: Nebula}){
    super();
    this.info = attrs;
    this.layout = {
      tileBox: new Container(),
      effectBox: new Container()
    }
    this.element = canvas()(
      this.layout.tileBox,
      this.layout.effectBox
    )
    this.init()
  }
  public update(){
    this.layout.tileBox.empty();

    const tileBox = this.layout.tileBox;
    const canvasSize = this.element.clientWidth;
    const canvasCenter = P(1, 1).scale(canvasSize / 2)
    const grid = gridify(this.info.nebula.tree)
    const size = grid.size.x;
    const pivot = H(1, 0, 1).scale(size - 1);

    for (const pos of grid.range){
      const content = grid.at(pos);
      const tile = content ? new StarTile("none", content) : new Hexagon()
      const coord = pos.sub(pivot).toCoord(20).add(canvasCenter)

      tile.position = coord;
      tile.side = 20;

      tileBox.adopt(tile)
    }
  }
  public detect(){
    return true;
  }
}
export class StarTree extends UIManager {
  public readonly layout;
  public readonly info;
  public readonly element;

  public paletteGroups: {
    content: Content;
    element: HTMLLIElement;
  }[];

  constructor(attributes: { nebula: Nebula; }) {
    super();
    this.info = attributes;
    this.paletteGroups = [];
    this.layout = {
      tree: new StarTreeList(this.info),
      palette: {
        list: ul({ onclick: () => this.layout.palette.inputArea.classList.remove("hidden") })(),
        inputArea: new NebulaPalette(this.info).element
      },
      nebulaModel: new NebulaModel(this.info)
    };
    this.element = div()(
      div()(
        this.layout.palette.list,
        this.layout.palette.inputArea
      ),
      btn({ class: "bringer", onclick: () => this.putIntoNebula() })("->"),
      this.layout.tree.element,
      div({ class: "arrow-keys" })(
        btn({ class: "up-arrow", onclick: () => this.updent() })("위"),
        btn({ class: "left-arrow", onclick: () => this.outdent() })("왼"),
        btn({ class: "down-arrow", onclick: () => this.downdent() })("밑"),
        btn({ class: "right-arrow", onclick: () => this.indent() })("오")
      ),
      this.layout.nebulaModel.element
    );
    this.init();
  }
  public init() {
    this.layout.palette.list.append(...this.info.nebula.palette.map(c => selli()(span()(c.title))));
  }
  public detect() { return false; }
  public update() {}

  public putIntoNebula() {
    const item = this.layout.palette.list.querySelector(".selected");
    const content = this.paletteGroups.find(g => g.element === item)?.content;
    if (!item || !content) return;
    this.layout.tree.append(new StarTreeNode(content).element);
    item.classList.add("inserted");

    const lastInserteds = [...this.layout.palette.list.children].find(c => c.classList.contains("inserted"))

    if (lastInserteds) lastInserteds.before(item)
    else this.layout.palette.list.insertAdjacentElement('beforeend', item)
  }
}