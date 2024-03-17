import p5 from "p5";
import { WBody, WContainer, WMultiSelectMenu, WOption, WSelectMenu, WSimpleButton, WStateBox, WText } from "./objects";
import { CanvasObject } from "./objects/CanvasObject";
import { DOMObject } from "./objects/DOMObject";
import { WCheckbox, WInputText } from "./objects/input";
import { WDraggableItem, WDraggableList, WListItem, WListView, WSelectableItem, WSelectableList } from "./objects/list";

type Children<T extends DOMObject<any>> = T['family']['children']
type Attributes = {
    class: string
}
type SliAttributes<T> = Attributes & {
    data:T
}

function decorate(obj:DOMObject<any>, attrs:Partial<Attributes>){
    if (attrs.class) obj.class.add(attrs.class)
}
function decorateSli<T>(obj:WSelectableItem<T>, attrs:Partial<SliAttributes<T>>){
    decorate(obj, attrs)
    if (attrs.data) obj.data = attrs.data
}

//simple elements
const create = <T extends keyof HTMLElementTagNameMap>(tag:T, attrs?:Record<string,any>) => {
    const obj = document.createElement(tag)
    for(let a in attrs){
        if (a === "class"){
            obj.classList.add(attrs.class)
            continue;
        }
        if (a.startsWith("on")){
            (obj as any)[a] = attrs[a]
            continue;
        }
        obj.setAttribute(a, attrs[a])
    }
    return obj as HTMLElementTagNameMap[T];
}
export const btn = (attrs?:Record<string, any>) => 
    (text:string) => {
    const obj = create("button", attrs);
    obj.innerText = text;
    return obj;
};
export const span = (attrs?:Record<string, any>) => (
    (text:string) => {
        const obj = create("span", attrs)
        obj.innerText = text;
        return obj;
    }
);
export const statebox = (...states:string[]) => new WStateBox(states)
export const inputText = (attr?:Partial<{limit:"number", value: string}>) => new WInputText(attr?.limit).setValue(attr?.value ?? "")
export const checkbox = () => new WCheckbox()
export const body = (...children:HTMLElement[]) => (
    document.body.append(...children)
)
export const div = (attrs?:Record<string, any>) => (
    (...children:HTMLElement[]) => {
        const obj = create("div", attrs)
        obj.append(...children)
        return obj
    }
)
export const nav = (attrs?:Record<string, any>) => (
    (...children:HTMLElement[]) => {
        const obj = create("nav", attrs)
        obj.append(...children)
        return obj;
    }
)
export const a = (attrs?:Record<string,any>) => (
    (text:string) => {
        const obj = create("a", attrs)
        obj.innerText = text;
        return obj;
    }
)
export const table = (attrs?:Record<string,any>) => (
    (...children:(HTMLTableRowElement)[]) => {
        const obj = create("table", attrs)
        obj.append(...children)
        return obj;
    }
)
export const tr = (attrs?:Record<string,any>) => (
    (...children:HTMLTableCellElement[]) => {
        const obj = create("tr", attrs)
        obj.append(...children)
        return obj;
    }
)
export const td = (attrs?:Record<string,any>) => (
    (...children:HTMLElement[]) => {
        const obj = create("td", attrs)
        obj.append(...children)
        return obj;
    }
)
export const canvas = (attrs?:Record<string, any>) => (
    (...children:CanvasObject[]) => {
        const obj = div()()
        const p = new p5((pp:p5)=>{
            pp.setup = ()=>{
                const w = attrs?.width ?? pp.windowWidth;
                const h = attrs?.height ?? w;
                pp.createCanvas(w, h).parent(obj)
            }
            pp.draw = ()=>{
                pp.background("#aaaaaa")

                
            }
        })
        return obj;
    }
)
export const select = <T>(...children:WOption<T>[]) => (
    new WSelectMenu<T>().family.adoptAll(children)
)
export const multiselect = <T>(...children:WOption<T>[]) => (
    new WMultiSelectMenu<T>().family.adoptAll(children)
)
export const ul = <T>(...children:WListItem<T>[]) => (
    new WListView<T>().family.adoptAll(children)
)
export const option = <T>(text:string, data?:T) => (
    new WOption<T>(text, data)
)
export const sul = <T>(attrs?:Partial<Attributes>) => (
  (...children:Children<WSelectableList<T>>) => {
    const obj = new WSelectableList<T>().family.adoptAll(children)
    if (attrs) decorate(obj, attrs)
    return obj
  }
)
export const sli = <T>(attrs?:Partial<SliAttributes<T>>) =>(
    (...children:DOMObject<any>[]) => {
        const obj = new WSelectableItem<T>().family.adoptAll(children)
        if (attrs) decorateSli(obj, attrs)
        return obj;
    }
)
export const drul = <T>(...children:WDraggableItem<T>[]) => (
    new WDraggableList<T>().family.adoptAll(children)
)
export const drli = <T>(...children:DOMObject<any>[]) => (
    new WDraggableItem<T>().family.adoptAll(children)
)