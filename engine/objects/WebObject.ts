import {WoOption, WoTag} from "../types"

export abstract class WebObject<C extends WebObject<any, any>, P extends WebObject<any, any>>{
  protected element:HTMLElement;

  private $children:C[];
  public get children():C[]{
    return this.$children;
  };
  protected set children(v:C[]){
    this.$children = v;
  }

  private $parent:P;
  public get parent():P{
    return this.$parent;
  };
  protected set parent(v:P){
    this.$parent = v;
  }

  protected option:WoOption;
  public abstract get value();
  public abstract set value(v:any);
  public constructor(tag?: WoTag, option?: WoOption, children?: C[]){
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
  public get sibling():[WebObject<any,any>?, WebObject<any,any>?]{
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
  public remove():void{
    const c = this.parent?.children;
    this.element.remove()
    if (!c) return;
    c.splice(c.indexOf(this), 1)
  }
  public adopt(obj:C):C{
    this.element.appendChild(obj.element)  
    obj.parent.children = obj.parent.children.filter(o => o !== obj)
    obj.parent = this;
    this.children.push(obj)
    return obj;
  }
  public empty():WebObject<any,any>{
    this.element.innerHTML = "";
    this.children = []
    return this;
  }
  public bringDown(obj:WebObject<any,any>):WebObject<any,any>{
    this.element.insertAdjacentElement("afterend", obj.element)
    if (obj.parent)
      obj.parent.children = obj.parent.children.filter(a => a !== obj)
    obj.parent = this.parent;
    
    this.parent.children.splice(this.parent.children.indexOf(this) + 1, 0, obj)
    return this;
  }
  public promote():WebObject<any,any>{
    if (!this.element.previousElementSibling) return this;
    if (!this.element.parentElement) return this;
    this.element.parentElement.insertBefore(this.element, this.element.previousElementSibling)
    const index = this.parent.children.indexOf(this)
    this.parent.children[index] = this.parent.children[index - 1]
    this.parent.children[index - 1] = this;
    return this;
  }
  public demote():WebObject<any,any>{
    if (!this.element.nextElementSibling) return this;
    if (!this.element.parentElement) return this;
    this.element.parentElement.insertBefore(this.element.nextElementSibling, this.element)
    const index = this.parent.children.indexOf(this)
    this.parent.children[index] = this.parent.children[index + 1]
    this.parent.children[index + 1] = this;
    return this;
  }
  public addClass(className:string):WebObject<any,any>{
    this.element.classList.add(className)
    return this;
  }
  public removeClass(className:string):WebObject<any,any>{
    this.element.classList.remove(className)
    return this;
  }
}