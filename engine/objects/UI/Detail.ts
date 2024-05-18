import { div } from "@/funcObject";
import "../styles/Detail.css"

export class Detail {
  public readonly element;
  public readonly info;
  public readonly layout;

  private height:number = 0;
  
  constructor(attrs:{
    collapsed: boolean
  }, toggle:HTMLButtonElement, content:HTMLElement){
    this.layout = {
      toggle,
      content
    }
    this.element = div({class: "detail detail-collapsed"})([
      toggle,
      content
    ])

    toggle.classList.add("detail-toggle")
    content.classList.add("detail-content")

    this.info = attrs;
    let height = content.scrollHeight;
  
    toggle.addEventListener("click", () => {
      this.element.classList.toggle("detail-collapsed")
      this.info.collapsed = this.element.classList.contains("detail-collapsed")
    })
  }
  public update(){
    if (this.info.collapsed) {
      this.layout.content.style.maxHeight = "0"
      return;
    }
    const content = this.layout.content;
    const visibleSize = content.scrollHeight;

    content.style.height = "auto"
    content.style.maxHeight = `${visibleSize}px`
    content.style.height = `${Math.max(this.height, visibleSize)}px`

    this.height = visibleSize
  }
}