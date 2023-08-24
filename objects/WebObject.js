export class WebObject{
  element;
  children;
  parent;
  #color;
  #option;
  get value(){
    return this.element.innerText;
  }
  set value(v){
    this.element.innerText = v;
  }
  constructor(tag, option, children){
    this.children = [];
    this.#option = option;
    if (tag === "none") return;
    this.element = document.createElement(tag ?? "div");
    this.element.onclick = ()=>this.click();
    if (option?.class) 
      this.addClass(option.class)
    for (let c of (children??[]))
      this.adopt(c)
  }
  click(){
    this.#option?.onclick?.();
  }
  get sibling(){
    const c = this.parent.children;
    const tl = this.element;
    const pv = tl.previousElementSibling;
    const nx = tl.nextElementSibling;
    return [
      c.find(o => o.element === pv),
      c.find(o => o.element === nx)
    ]
  }
  remove(){
    const c = this.parent.children;
    c.splice(c.indexOf(this), 1)
    this.parent = undefined;
    this.element.remove()
  }
  adopt(obj){
    this.element.appendChild(obj.element)
    if (obj.parent)
      obj.parent.children = obj.parent.children.filter(o => o !== obj)
    obj.parent = this;
    this.children.push(obj)
    return obj;
  }
  empty(){
    this.element.innerHTML = "";
    this.children = []
  }
  bringDown(obj){
    this.element.insertAdjacentElement("afterend", obj.element)
    obj.parent.children = obj.parent.children.filter(a => a !== obj)
    obj.parent = this.parent;
    
    this.parent.children.splice(this.parent.children.indexOf(this) + 1, 0, obj)
  }
  promote(){
    if (!this.element.previousElementSibling) return;
    this.element.parentElement.insertBefore(this.element, this.element.previousElementSibling)
    const index = this.parent.children.indexOf(this)
    this.parent.children[index] = this.parent.children[index - 1]
    this.parent.children[index - 1] = this;
  }
  demote(){
    if (!this.element.nextElementSibling) return;
    this.element.parentElement.insertBefore(this.element.nextElementSibling, this.element)
    const index = this.parent.children.indexOf(this)
    this.parent.children[index] = this.parent.children[index + 1]
    this.parent.children[index + 1] = this;
  }
  addClass(className){
    this.element.classList.add(className)
  }
  removeClass(className){
    this.element.classList.remove(className)
  }
  get color(){
    return this.#color;
  }
  set color(v){
    this.element.style.background = v;
    this.#color = v
  }
}