import { WContainer, WMultiSelectMenu, WOption, WSelectMenu, WSimpleButton, WStateBox, WText } from "./objects";
import { DOMObject } from "./objects/DOMObject";
import { WListItem, WListView, WSelectableItem, WSelectableList } from "./objects/list";

//simple elements
export const btn = (text:string) => new WSimpleButton(text);
export const span = (text:string) => new WText(text);
export const statebox = (...states:string[]) => new WStateBox(states)

const element = <A, C extends DOMObject<any>, T extends DOMObject<any>>(obj:T, func?:(obj:T, attributes:Partial<A>)=>void) => (
    (attributes:Partial<A>) => (
        (...children:C[]) => {
            obj.family.adoptAll(children)
            func?.(obj, attributes)
            return obj;
        }
    )
)

export const div = element<{class:string}, DOMObject<any>, WContainer>(
    new WContainer(),
    (obj, attr)=>{
        if(attr.class) obj.class.add(attr.class)
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
export const sul = <T>(...children:WSelectableItem<T>[]) => (
    new WSelectableList<T>().family.adoptAll(children)
)
export const sli = <T>(...children:DOMObject<any>[]) => (
    new WSelectableItem<T>().family.adoptAll(children)
)

//decorators
function adoptAll(obj:DOMObject<any>, children:DOMObject<any>[]) {
    return obj.family.adoptAll(children)
}
function addClass(obj:DOMObject<any>, className:string){
    return obj.class.add(className)
}