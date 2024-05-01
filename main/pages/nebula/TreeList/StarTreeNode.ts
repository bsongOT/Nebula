import { div, li, span, ul } from "@/funcObject";
import { Content } from "../../../data/Data";
import { UIManager } from "@/objects/UIManager";


export class StarTreeNode extends UIManager {
  public readonly element: HTMLLIElement;
  public readonly content: Content;
  public readonly info;
  public readonly layout;

  constructor(content: Content) {
    super();
    this.content = content;
    this.info = {};
    this.layout = {
      main: div()(span()(content.title)),
      list: ul()()
    };
    this.element = li()(
      this.layout.main,
      this.layout.list
    );
    this.init();
  }
  public update() { }
  public detect = () => false;
}
