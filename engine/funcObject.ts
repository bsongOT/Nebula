import p5 from "p5";
import { CanvasObject } from "./objects/CanvasObject";
import { Tree, TreeNode } from "./data-structure/tree";
import { Coord } from "./utils/math/coord-system";
import { engine } from "./engine";

export type Functionize<T> = {
    [key in keyof T]: (element: T) => T[key]
}
export type UpdatedAttribute<T extends HTMLElement> = Partial<Functionize<T>> & {inlineStyle?:(element: T) => Partial<CSSStyleDeclaration>}
export type Tag = keyof HTMLElementTagNameMap;
export type Attribute<T extends Tag> = Partial<HTMLElementTagNameMap[T]> & {class?:string, inlineStyle?:Partial<CSSStyleDeclaration>};
export type ChildrenAttribute<T extends HTMLElement, C extends HTMLElement = HTMLElement> = C[] | ((element:T) => C[]) | string | ((element:T) => string)

function mustUpdateChildren(element:HTMLElement, children:HTMLElement[]){
    if (children.length !== element.children.length) return true;
    for (let i = 0; i < children.length; i++){
        if (children[i] !== element.children[i]) return true;
    }
    return false;
}
function updateChildren<T extends HTMLElement>(element:T, children?:ChildrenAttribute<T>){
    if (children === undefined || children === null) return;
    const childs = typeof children === "function" ? children(element) : children

    if (typeof childs === "string"){
        if (element.innerText === childs) return;
        element.innerText = childs;
        return;
    }

    if (mustUpdateChildren(element, childs)) {
        element.innerHTML = "";
        element.append(...childs);
    }
}

function update<T extends HTMLElement>(element:T, attrs?:UpdatedAttribute<T>, children?:ChildrenAttribute<T>){
    if (!document.contains(element)) return;
  
    for (const k in attrs){
      if (k === "inlineStyle") continue;

      const key = k as keyof Partial<Functionize<T>>;
      const data = attrs[key]?.(element) as T[keyof T];

      if (element[key] === data) continue;
      element[key] = data!;
    }

    if (attrs?.inlineStyle){
        Object.assign(element.style, attrs.inlineStyle(element));
    }

    updateChildren(element, children);
}
const create = <T extends Tag>(
    tag:T, 
    attrs?:Attribute<T>, 
    updatedAttrs?:UpdatedAttribute<HTMLElementTagNameMap[T]>, 
    children?:ChildrenAttribute<HTMLElementTagNameMap[T]>
) => {
    const obj = document.createElement(tag);
    for(const key in attrs){
        const k = key as keyof Attribute<T>

        if (k === "class"){
            obj.classList.add(...attrs.class!.split(" "))
        }
        else {
            obj[key as keyof HTMLElementTagNameMap[T]] = (attrs as any)[key]!;
        }
    }
    engine.updater.register(() => update(obj, updatedAttrs, children))
    return obj;
}
const independentElement = <T extends Tag>(tag:T) => (
    (attrs?:Attribute<T>, updatedAttrs?:UpdatedAttribute<HTMLElementTagNameMap[T]>) => (
        () => create(tag, attrs, updatedAttrs)
    )
)
const simpleElement = <T extends Tag>(tag:T) => (
    (attrs?:Attribute<T>, updatedAttrs?:UpdatedAttribute<HTMLElementTagNameMap[T]>) => (
        (text?:string) => {
            const obj = create(tag, attrs, updatedAttrs)
            obj.innerText = text ?? "";
            return obj;
        }
    )
)
const element = <T extends Tag, C extends HTMLElement = HTMLElement>(tag:T) => (
    (attrs?:Attribute<T>, updatedAttrs?:UpdatedAttribute<HTMLElementTagNameMap[T]>) => (
        (children?:ChildrenAttribute<HTMLElementTagNameMap[T], C>) => {
            const obj = create(tag, attrs, updatedAttrs, children);
            updateChildren(obj, children)
            return obj;
        }
    )
)
export const textarea = simpleElement("textarea");
export const inputText = independentElement("input")
export const slider = (attrs?:Attribute<"input">, updatedAttrs?:UpdatedAttribute<HTMLInputElement>) => {
  const obj = independentElement("input")(attrs, updatedAttrs)();
  obj.type = "range"
  return obj;
}
export const btn = simpleElement("button")
export const span = simpleElement("span")
export const a = simpleElement("a")
export const div = element("div")
export const nav = element("nav")
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