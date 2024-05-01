import { div } from "@/funcObject";
import "../../styles/RadioBox.css"

export class RadioBox {
  public readonly element;
  public readonly info;

  constructor(attrs:{
    direction?:"row"|"column",
    children: HTMLElement[]
  }){
    this.info = attrs;
    this.element = div()(...attrs.children);
  }
}