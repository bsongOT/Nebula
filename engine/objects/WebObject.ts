import { Family } from "@/factors/Family";
import { Input } from "@/factors/Input";
import { Class } from "@/factors/Class";
import { Style } from "@/factors/Style";

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
  public abstract readonly class:Class<this>;
  public readonly family!:Family<WebObject, HTMLObject, this>;
  public abstract readonly style:Style;
  constructor(){
    super()
    this.initFamily()
  }
  protected initFamily(){
    const event = this.family.event;
    
    const onremove = () => this.element.remove()
    const onadopt = <T>(member:T) => {
      if (!(member instanceof HTMLObject)) return;
      this.element.appendChild(member.element)
    }
    const onbringDown = (obj: WebObject) => {
      if (!(obj instanceof HTMLObject)) return;
      this.element.insertAdjacentElement('afterend', obj.element)
    }
    const onbringUp = (obj: WebObject)=>{
      if (!(obj instanceof HTMLObject)) return;
      this.element.insertAdjacentElement('beforebegin', obj.element)
    }

    event.remove.register(onremove)
    event.adopt.register(onadopt)
    event.bringDown.register(onbringDown)
    event.bringUp.register(onbringUp)
  }
  protected initInput(){
    this.element.onclick = () => this.input.click.invoke()
    this.element.oncontextmenu = () => this.input.contextmenu.invoke()
    this.element.ondblclick = () => this.input.doubleclick.invoke()
  }
}
