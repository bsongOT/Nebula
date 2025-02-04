import p5 from "p5";
import { Tree, TreeNode } from "./data-structure/tree";
import { Coord } from "./utils/math/coord-system";
import { Updated, engine } from "./engine";

export type Attribute<T extends Tag> = Partial<{
    [key in keyof HTMLElementTagNameMap[T]]: HTMLElementTagNameMap[T][key] | Updated<HTMLElementTagNameMap[T], HTMLElementTagNameMap[T][key]>
}> & {
    class?: string | Updated<HTMLElementTagNameMap[T], string>,
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

function updateChildren<T extends HTMLElement>(element:T, children:HTMLElement[] | ((element:T) => string)){
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
    for (let i = element.children.length - 1; i >= childs.length; i--){
        element.children[i].remove();
    }
}
function updateAttrs<T extends Tag>(element:HTMLElementTagNameMap[T], attrs:UpdatedAttribute<T>){
    const _attrs = Object.assign({}, attrs);

    if (_attrs.inlineStyle){
        Object.assign(element.style, _attrs.inlineStyle.attr(element));
    }

    delete _attrs.inlineStyle;

    for (const k in _attrs){
        const key = k as keyof Partial<HTMLElementTagNameMap[T]>;
        const data = attrs[key]?.attr(element) as any;

        if (element[key] === data) continue;
        element[key] = data!;
    }
}

const create = <T extends Tag>(
    tag:T, 
    attrs?:Attribute<T>,
    ...children:ChildrenAttribute<HTMLElementTagNameMap[T]>
) => {
    const obj = document.createElement(tag);
    const childs = children[0];

    if (attrs){
        const initialAttrs = Object.assign({}, 
            ...Object.keys(attrs)
                .map(k =>{
                    const attr = attrs[k as keyof Attribute<T>]
                    return ({[k]: attr instanceof Updated ? attr.attr(obj) : attr})
                })
        )
        if (attrs.class){
            attrs.className = attrs.class;
            delete attrs.class;
        }
        if (attrs.inlineStyle){
            Object.assign(obj.style, attrs.inlineStyle instanceof Updated ? attrs.inlineStyle.attr(obj) : attrs.inlineStyle)
        }
        for(const key in attrs){
            const k = key as keyof Attribute<T>

            if (k === "inlineStyle") continue;
            
            const attr = (attrs as any)[key]!;
            obj[key as keyof HTMLElementTagNameMap[T]] = attr instanceof Updated ? attr.attr(obj) : attr;
        }
        const updatedAttrs = Object.assign({},
            ...Object.keys(attrs)
                .filter(k => attrs[k as keyof Attribute<T>] instanceof Updated)
                .map(k => ({[k]: attrs[k as keyof Attribute<T>]}))
        )
        if (Object.keys(updatedAttrs).length !== 0) {
            const attrUpdater = () => {
                if (!document.contains(obj)){
                    if (obj.dataset.isDisposable === "") engine.updater.unregister(attrUpdater);
                    return;
                }
                updateAttrs(obj, updatedAttrs)
            }
            engine.updater.register(attrUpdater)
        }
    }

    if (childs){
        if (childs instanceof Array || typeof childs === 'function'){
            const childrenUpdater = () => {
                if (!document.contains(obj)){
                    if (obj.dataset.isDisposable === "") engine.updater.unregister(childrenUpdater);
                    return;
                }
                updateChildren(obj, childs)
            };
            engine.updater.register(childrenUpdater)
        }
        else {
            if (typeof childs === 'string') obj.innerText = childs;
            else if (childs instanceof Element) obj.append(...children as HTMLElement[])
        }
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
export const h1 = element<"h1", never>("h1");
export const h2 = element<"h2", never>("h2");
export const h3 = element<"h3", never>("h3");
export const h4 = element<"h4", never>("h4");

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
export const ol = element<"ol", HTMLLIElement>("ol")
export const li = element("li")

//Special
export const body = (...children:HTMLElement[]) => (
    document.body.append(...children)
)
export const canvas = (attrs?:Partial<HTMLCanvasElement>) => (
    (useP5:(p5:p5) => void) => 
        new Promise<HTMLCanvasElement>(resolve => {
            const p = new p5((pp:p5) => {
                pp.setup = ()=>{
                    const w = attrs?.width ?? pp.windowWidth;
                    const h = attrs?.height ?? w;
                    resolve(pp.createCanvas(w, h).elt)
                    useP5(p)
                }
            })
        })
)