import { WContainer, WMultiSelectMenu, WOption, WSelectMenu, WSimpleButton, WStateBox, WText } from "./objects";
import { DOMObject } from "./objects/DOMObject";

export const div = (...children:DOMObject<any>[]) => (
    new WContainer().family.adoptAll(children)
)
export const btn = (text:string) => new WSimpleButton(text)
export const select = <T>(...children:WOption<T>[]) => (
    new WSelectMenu<T>().family.adoptAll(children)
)
export const multiselect = <T>(...children:WOption<T>[]) => (
    new WMultiSelectMenu<T>().family.adoptAll(children)
)
export const span = (text:string) => new WText(text)
export const statebox = (...states:string[]) => new WStateBox(states)