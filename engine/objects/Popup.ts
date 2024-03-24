import { div } from "@/funcObject"
import "../styles/popup.css"

export class WPopup {
  public readonly element:HTMLDivElement
  public readonly hide:()=>void
  public readonly show:()=>void

  constructor(trigger:HTMLButtonElement, content:HTMLElement){
    this.element = div({class: "popup"})(
      trigger,
      div({class: "popup-background", onclick: ()=>this.hide})(
        content
      )
    )
        
    trigger.classList.add("popup-trigger")
    content.classList.add("popup-content")

    trigger.addEventListener("click", () => this.show())

    this.hide = () => {
      this.element.classList.add("popup-hidden")
    }
    this.show = () => {
      this.element.classList.remove("popup-hidden")
    }
  }
}