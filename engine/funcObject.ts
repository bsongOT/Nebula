import p5 from "p5";
import { CanvasObject } from "./objects/CanvasObject";
import { Tree, TreeNode } from "./data-structure/tree";
import { Coord } from "./utils/math/coord-system";
import { isTypeReferenceNode } from "typescript";

type Tag = keyof HTMLElementTagNameMap;
const create = <T extends Tag>(tag:T, attrs?:Record<string,any>) => {
    const obj = document.createElement(tag)
    for(let a in attrs){
        if (a === "class"){
            obj.classList.add(attrs.class)
        }
        else if (a.startsWith("on")){
            (obj as any)[a] = attrs[a]
        }
        else obj.setAttribute(a, attrs[a])
    }
    return obj as HTMLElementTagNameMap[T];
}
const independentElement = <T extends Tag>(tag:T) => (
    (attrs?:Record<string, any>) => (
        () => create(tag, attrs)
    )
)
const simpleElement = <T extends Tag>(tag:T) => (
    (attrs?:Record<string,any>) => (
        (text:string) => {
            const obj = create(tag, attrs)
            obj.innerText = text;
            return obj;
        }
    )
)
const element = <T extends Tag, C extends HTMLElement = HTMLElement>(tag:T) => (
    (attrs?:Record<string,any>) => (
        (...children:C[]) => {
            const obj = create(tag, attrs);
            obj.append(...children)
            return obj;
        }
    )
)
export const textarea = simpleElement("textarea");
export const inputText = independentElement("input")
export const slider = (attrs?:Record<string,any>) => {
  const obj = independentElement("input")(attrs)();
  obj.type = "range"
  return obj;
}
export const btn = simpleElement("button")
export const span = simpleElement("span")
export const a = simpleElement("a")
export const checkbox = (attrs?:Record<string,any>) => {
    const obj = independentElement("input")(attrs)()
    obj.type = "checkbox"
    return obj;
}
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