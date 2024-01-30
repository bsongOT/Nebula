import { WBody, WContainer, WMultiSelectMenu, WOption, WSelectMenu, WSimpleButton, WStateBox, WText } from "./objects";
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
export const btn = (text:string) => new WSimpleButton(text);
export const span = (text:string) => new WText(text);
export const statebox = (...states:string[]) => new WStateBox(states)
export const inputText = (limit?:"number") => new WInputText(limit)
export const checkbox = () => new WCheckbox()

export const body = (...children:DOMObject<any> []) => (
    WBody.instance.family.adoptAll(children)
)
export const div = (attrs?:Partial<Attributes>) => (
    (...children:Children<WContainer>) => {
        const obj = new WContainer().family.adoptAll(children)
        if (attrs) decorate(obj, attrs)
        return obj
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