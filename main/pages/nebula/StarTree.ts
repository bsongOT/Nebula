import { btn, div, li, span, ul } from "@/funcObject";
import { Content, Nebula } from "../../data/Data";
import { UIManager } from "@/objects/UIManager";
import { NebulaPalette } from "./NebulaPalette/NebulaPalette";
import { StarTreeList } from "./TreeList/StarTreeList";
import { StarTreeNode } from "./TreeList/StarTreeNode";
import { DataCollection } from "../../data/DataCollection";
import { NebulaModel } from "./NebulaModel/NebulaModel";
import "./StarTree.css"
import { selli } from "@/objects/UI/list/selli";

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
      div({class: "tree-switch-box"})(
        selli({onclick: () => this.switchView(this.layout.palette)})(span()("Palette")),
        div({class: "bringer"})(
          btn()("->"),
          span()("")
        ),
        selli({onclick: () => this.switchView(this.layout.tree)})(span()("Tree"))
      ),
      this.layout.view,
      div({ class: "arrow-keys" })(
        btn({ 
          class: "up-arrow", 
          onclick: () => this.layout.tree.updent() 
        })("위"),
        btn({ class: "left-arrow", onclick: () => this.layout.tree.outdent() })("왼"),
        btn({ class: "down-arrow", onclick: () => this.layout.tree.downdent() })("밑"),
        btn({ class: "right-arrow", onclick: () => this.layout.tree.indent() })("오")
      ),
      this.layout.nebulaModel.element,
    );
    this.init();
  }
  public switchView(view:UIManager){
    this.layout.view.innerHTML = "";
    this.layout.view.append(view.element)
  }

  public putIntoNebula() {
    const select = this.layout.palette.info.selectedContents;

    this.layout.palette.kill();
    this.layout.tree.insert(...select)
  }
}