import p5 from "p5";
import { CanvasObject } from "./CanvasObject";
import { Tree, TreeNode } from "./data-structure/tree";
import { Coord } from "./utils/math/coord-system";
import { Updated, engine } from "./engine";

export type Attribute<T extends Tag> = Partial<{
    [key in keyof HTMLElementTagNameMap[T]]: HTMLElementTagNameMap[T][key] | Updated<HTMLElementTagNameMap[T], HTMLElementTagNameMap[T][key]>
}> & {
    class?: string,
    inlineStyle?: Partial<CSSStyleDeclaration> | Updated<HTMLElementTagNameMap[T], Partial<CSSStyleDeclaration>>
}
export type UpdatedAttribute<T extends Tag> = Partial<{
    [key in keyof HTMLElementTagNameMap[T]]: Updated<HTMLElementTagNameMap[T], HTMLElementTagNameMap[T][key]>
}> & {
    inlineStyle?: Updated<HTMLElementTagNameMap[T], Partial<CSSStyleDeclaration>>
}
export type Tag = keyof HTMLElementTagNameMap;
export type ChildrenAttribute<T extends HTMLElement, C extends HTMLElement = HTMLElement> = 
    C[] | [C[]] | [string] | [(element:T) => string]

function updateChildren<T extends HTMLElement>(element:T, children?:HTMLElement[] | ((element:T) => string)){
    if (children === undefined || children === null) return;
    const childs = typeof children === "function" ? children(element) : children

    if (typeof childs === "string"){
        if (element.innerText === childs) return;
        element.innerText = childs;
        return;
    }

    for (let i = 0; i < childs.length; i++){
        const old = element.children[i];
        const recent = childs[i];
        if (old === recent) continue;
        if (old) old.before(recent);
        else element.insertAdjacentElement("beforeend", recent);
    }
    for (let i = childs.length; i < element.children.length; i++){
        element.children[i].remove();
    }
}

function update<T extends Tag>(element:HTMLElementTagNameMap[T], attrs?:UpdatedAttribute<T>, children?:HTMLElement[] | ((element:HTMLElementTagNameMap[T]) => string)){
    if (!document.contains(element)) return;
  
    for (const k in attrs){
      if (k === "inlineStyle") continue;

      const key = k as keyof Partial<HTMLElementTagNameMap[T]>;
      const data = attrs[key]?.attr(element) as any;

      if (element[key] === data) continue;
      element[key] = data!;
    }

    if (attrs?.inlineStyle){
        Object.assign(element.style, attrs.inlineStyle.attr(element));
    }

    updateChildren(element, children);
}
function getUpdatedAttrs<T extends Tag>(attrs?:Attribute<T>){
    if (!attrs) return;

}
const create = <T extends Tag>(
    tag:T, 
    attrs?:Attribute<T>,
    ...children:ChildrenAttribute<HTMLElementTagNameMap[T]>
) => {
    const obj = document.createElement(tag);
    const childs = children[0];

    if (!attrs) {
        if (childs instanceof Array || typeof childs === 'function'){
            engine.updater.register(() => update(obj, undefined, childs))
            console.log("Child Updating!!")
        }
        else {
            if (typeof childs === 'string') obj.innerText = childs;
            else if (children[0] instanceof HTMLElement) obj.append(...children as HTMLElement[])
            engine.updater.register(() => update(obj));
        }
        return obj;
    }
    for(const key in attrs){
        const k = key as keyof Attribute<T>

        if (k === "class"){
            obj.classList.add(...attrs.class!.split(" "))
        }
        else if (k === "inlineStyle"){
            Object.assign(obj.style, attrs.inlineStyle instanceof Updated ? attrs.inlineStyle.attr(obj) : attrs.inlineStyle)
        }
        else {
            const attr = (attrs as any)[key]!;
            obj[key as keyof HTMLElementTagNameMap[T]] = attr instanceof Updated ? attr.attr(obj) : attr;
        }
    }
    const updatedAttrs = Object.assign({},
        ...Object.keys(attrs)
            .filter(k => attrs[k as keyof Attribute<T>] instanceof Updated)
            .map(k => ({[k]: attrs[k as keyof Attribute<T>]}))
    )

    if (childs instanceof Array || typeof childs === 'function'){
        engine.updater.register(() => update(obj, updatedAttrs, childs))
        console.log("Child Updating!!")
    }
    else {
        if (typeof childs === 'string') obj.innerText = childs;
        else if (children[0] instanceof HTMLElement) obj.append(...children as HTMLElement[])
        engine.updater.register(() => update(obj, updatedAttrs));
    }

    return obj;
}
const independentElement = <T extends Tag>(tag:T) => (
    (attrs?:Attribute<T>) => (
        () => create(tag, attrs)
    )
)
const element = <T extends Tag, C extends HTMLElement = HTMLElement>(tag:T) => (
    (attrs?:Attribute<T>) => (
        (...children:ChildrenAttribute<HTMLElementTagNameMap[T], C>) => {
            const obj = create(tag, attrs, ...children);
            return obj;
        }
    )
)
export const textarea = element<"textarea", never>("textarea");
export const btn = element<"button", never>("button");
export const a = element<"a", never>("a");

export const hr = independentElement("hr");
export const inputText = independentElement("input")
export const slider = (attrs?:Attribute<"input">) => {
  const obj = independentElement("input")(attrs)();
  obj.type = "range"
  return obj;
}
export const select = element<"select", HTMLOptionElement>("select");
export const option = element<"option", never>("option")
export const span = element("span");
export const div = element("div");
export const nav = element("nav");
export const button = element("button");

export const table = element<"table", HTMLTableRowElement>("table")
export const tr = element<"tr", HTMLTableCellElement>("tr")
export const td = element("td")

export const ul = element<"ul", HTMLLIElement>("ul")
export const li = element("li")

//Special
export const body = (...children:HTMLElement[]) => (
    document.body.append(...children)
)
export const canvas = (attrs?:Record<string, any>) => (
    (...children:CanvasObject[]) => {
        const childTree = new Tree<CanvasObject>()
        const obj = div()()
        const p = new p5((pp:p5) => {
            pp.setup = ()=>{
                const w = attrs?.width ?? pp.windowWidth;
                const h = attrs?.height ?? w;
                pp.createCanvas(w, h).parent(obj)
                children.forEach(c => childTree.insert(new TreeNode(childTree, c)))
            }
            pp.draw = ()=>{
                pp.background("#aaaaaa")

                childTree.tourNode(childTree.root,
                n => {
                    (n as any).node = n;
                    n.data.update();
                    n.data.render(pp)
                })
            }
            pp.mousePressed = () => {
                childTree.tour(n => {
                    if (n.isIn(new Coord(p.mouseX, p.mouseY)))
                        console.log("clicked")//n.onclick()
                })
            }
        })
        return obj;
    }
)