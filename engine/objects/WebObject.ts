import { WoTag } from "../types"
import { Family } from "@/factors/families/Family";
import { Input } from "@/factors/events/Input";
import { Classifier } from "@/factors/class/Classifier";

export abstract class WebObject{
  public readonly family:Family<WebObject, WebObject, this>;
  public readonly input:Input<this>;
  constructor(){
    this.family = Family.new(this)
    this.input = Input.new(this)
  }
}
export abstract class HTMLObject extends WebObject {
  protected abstract readonly element:HTMLElement;
  public abstract readonly class:Classifier<this>;
  public readonly family!:Family<WebObject, HTMLObject, this>;
  constructor(){
    super()
    this.family.event
      .remove.register(()=>{
        this.element.remove()
      })
    this.family.event
      .adopt.register((member)=>{
        if (!(member instanceof HTMLObject)) return;
        this.element.appendChild(member.element)
      })
    this.family.event
      .bringDown.register((obj: WebObject)=>{
        if (!(obj instanceof HTMLObject)) return;
        this.element.insertAdjacentElement('afterend', obj.element)
      })
    this.family.event
      .bringUp.register((obj: WebObject)=>{
        if (!(obj instanceof HTMLObject)) return;
        this.element.insertAdjacentElement('beforebegin', obj.element)
      })
  }
}
export abstract class DOMObject extends HTMLObject {
  protected readonly element:HTMLElement;
  public readonly class:Classifier<this>;
  public get style(){ return this.element.style;}
  public get scrollHeight(){
    return this.element.scrollHeight;
  }
  constructor(tag?:WoTag){
    super()
    this.element = document.createElement(tag ?? "div");
    this.class = new Classifier(this, this.element)
  }
}