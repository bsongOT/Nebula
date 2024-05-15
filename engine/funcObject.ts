import p5 from "p5";
import { CanvasObject } from "./objects/CanvasObject";
import { Tree, TreeNode } from "./data-structure/tree";
import { Coord } from "./utils/math/coord-system";
import { engine } from "./engine";

export type Functionize<T> = {
    [key in keyof T]: (element: T) => T[key]
}
type Tag = keyof HTMLElementTagNameMap;
type Attribute<T extends Tag> = Partial<HTMLElementTagNameMap[T]> & {class?:string};
function update<T extends HTMLElement>(element:T, attrs?:Partial<Functionize<T>>){
    if (!document.contains(element)) return;
  
    for (const k in attrs){
      const key = k as keyof Partial<Functionize<T>>;
      const data = attrs[key]?.(element);
  
      if (element[key] === data) continue;
      element[key] = data!;
    }
  }
const create = <T extends Tag>(tag:T, attrs?:Attribute<T>, updatedAttrs?:Partial<Functionize<HTMLElementTagNameMap[T]>>) => {
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
    engine.updater.register(() => update(obj, updatedAttrs))
    return obj;
}
const independentElement = <T extends Tag>(tag:T) => (
    (attrs?:Attribute<T>, updatedAttrs?:Partial<Functionize<HTMLElementTagNameMap[T]>>) => (
        () => create(tag, attrs, updatedAttrs)
    )
)
const simpleElement = <T extends Tag>(tag:T) => (
    (attrs?:Attribute<T>, updatedAttrs?:Partial<Functionize<HTMLElementTagNameMap[T]>>) => (
        (text:string) => {
            const obj = create(tag, attrs, updatedAttrs)
            obj.innerText = text;
            return obj;
        }
    )
)
const element = <T extends Tag, C extends HTMLElement = HTMLElement>(tag:T) => (
    (attrs?:Attribute<T>, updatedAttrs?:Partial<Functionize<HTMLElementTagNameMap[T]>>) => (
        (...children:C[]) => {
            const obj = create(tag, attrs, updatedAttrs);
            obj.append(...children)
            return obj;
        }
    )
)
export const textarea = simpleElement("textarea");
export const inputText = independentElement("input")
export const slider = (attrs?:Attribute<"input">, updatedAttrs?:Partial<Functionize<HTMLInputElement>>) => {
  const obj = independentElement("input")(attrs, updatedAttrs)();
  obj.type = "range"
  return obj;
}
export const btn = simpleElement("button")
export const span = simpleElement("span")
export const a = simpleElement("a")
export const div = element("div")
export const nav = element("nav")

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