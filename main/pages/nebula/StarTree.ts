import { btn, div, li, span, ul } from "@/funcObject";
import { Content, Nebula } from "../../data/Data";
import { UIManager } from "@/objects/UIManager";
import { selli } from "@/objects/UI/list/selli";
import { NebulaPalette } from "./NebulaPalette";
import { StarTreeList, StarTreeNode } from ".";
import { DataCollection } from "../../data/DataCollection";
import { NebulaModel } from "./NebulaModel";
import { UIUpdater } from "@/objects/UIUpdater";

export class StarTree extends UIManager {
  public readonly layout;
  public readonly info;
  public readonly data;
  public readonly selection;
  public readonly element;

  public paletteGroups: {
    content: Content;
    element: HTMLLIElement;
  }[];

  constructor(data:{contents: DataCollection<Content> }, selection: {nebula?: Nebula}) {
    super();
    this.info = {};
    this.data = data;
    this.selection = selection;
    this.paletteGroups = [];
    this.layout = {
      tree: new StarTreeList(this.selection),
      palette: new NebulaPalette(data, selection),
      nebulaModel: new NebulaModel(selection),
      view: div()()
    };
    this.element = div()(
      div()(
        btn({onclick: () => this.switchView(this.layout.palette)})("Palette"),
        div()(
          btn({class: "bringer"})("->"),
          new UIUpdater(span()(""), {innerText: () => `${this.layout.palette.info.selectedContents.length}개 선택됨`}).element
        ),
        btn({onclick: () => this.switchView(this.layout.tree)})("Tree")
      ),
      this.layout.view,
      div({ class: "arrow-keys" })(
        btn({ class: "up-arrow", onclick: () => this.layout.tree.updent() })("위"),
        btn({ class: "left-arrow", onclick: () => this.layout.tree.outdent() })("왼"),
        btn({ class: "down-arrow", onclick: () => this.layout.tree.downdent() })("밑"),
        btn({ class: "right-arrow", onclick: () => this.layout.tree.indent() })("오")
      ),
      this.layout.nebulaModel.element,
      this.layout.palette.layout.text.element
    );
    this.init();
  }
  public init() {
    this.layout.view.append(this.layout.palette.element)
    super.init();
  }
  public detect() { return false; }
  public update() {}

  public switchView(view:UIManager){
    this.layout.view.innerHTML = "";
    this.layout.view.append(view.element)
  }

  public putIntoNebula() {
    const select = this.layout.palette.info.selectedContent;

    if (!select) return;

    this.layout.palette.kill();
    this.layout.tree.insert(select)
  }
}