import { ul } from "@/funcObject";

type SelectableListInfo = {
    min?:number,
    max?:number,
    selectedElements:HTMLLIElement[]
    children:HTMLLIElement[]
}
export class SelectableList {
  public readonly element;
  public readonly info;

  constructor(attrs:SelectableListInfo){
    this.element = ul()(...attrs.children);
    this.info = attrs;

    attrs.children.forEach(c => {
        c.addEventListener("onclick", () => {
            c.classList.add("selected");
        })
    })
  }

  public update(){
    const selectedElements = this.element.getElementsByClassName("selected");
    //TODO
  }
}