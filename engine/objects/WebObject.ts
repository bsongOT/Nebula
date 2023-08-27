import {WoOption, WoTag} from "../types"

export class WebObject{
  protected element:HTMLElement;
  public children:WebObject[];
  public parent:WebObject;
  protected option:WoOption;
  get value():any{
    return this.element.innerText;
  }
  set value(v:any){
    this.element.innerText = v;
  }
  constructor(tag?: WoTag, option?: WoOption, children?: WebObject[]){
    this.children = [];
    this.option = option ?? {};
    if (tag === "none") return;
    this.element = document.createElement(tag ?? "div");
    this.element.onclick = ()=>this.click();
    if (option?.class) 
      this.addClass(option.class)
    for (let c of (children??[]))
      this.adopt(c)
  }
  protected click():void{
    this.option?.onclick?.();
  }
  get sibling():[WebObject?, WebObject?]{
    const c = this.parent?.children;
    if (!c) return [undefined, undefined]
    const tl = this.element;
    const pv = tl.previousElementSibling;
    const nx = tl.nextElementSibling;
    return [
      c.find(o => o.element === pv),
      c.find(o => o.element === nx)
    ]
  }
  remove():void{
    const c = this.parent?.children;
    this.element.remove()
    if (!c) return;
    c.splice(c.indexOf(this), 1)
  }
  adopt(obj:WebObject):WebObject{
    this.element.appendChild(obj.element)  
    obj.parent.children = obj.parent.children.filter(o => o !== obj)
    obj.parent = this;
    this.children.push(obj)
    return obj;
  }
  empty():void{
    this.element.innerHTML = "";
    this.children = []
  }
  bringDown(obj:WebObject):void{
    this.element.insertAdjacentElement("afterend", obj.element)
    if (obj.parent)
      obj.parent.children = obj.parent.children.filter(a => a !== obj)
    obj.parent = this.parent;
    
    this.parent.children.splice(this.parent.children.indexOf(this) + 1, 0, obj)
  }
  promote():WebObject{
    if (!this.element.previousElementSibling) return this;
    if (!this.element.parentElement) return this;
    this.element.parentElement.insertBefore(this.element, this.element.previousElementSibling)
    const index = this.parent.children.indexOf(this)
    this.parent.children[index] = this.parent.children[index - 1]
    this.parent.children[index - 1] = this;
    return this;
  }
  demote():WebObject{
    if (!this.element.nextElementSibling) return this;
    if (!this.element.parentElement) return this;
    this.element.parentElement.insertBefore(this.element.nextElementSibling, this.element)
    const index = this.parent.children.indexOf(this)
    this.parent.children[index] = this.parent.children[index + 1]
    this.parent.children[index + 1] = this;
    return this;
  }
  addClass(className:string):void{
    this.element.classList.add(className)
  }
  removeClass(className:string):void{
    this.element.classList.remove(className)
  }
}