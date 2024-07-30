import { btn, div, inputText, li, option, select, span, ul } from "@/funcObject";
import { DataCollection } from "../data/DataCollection";
import "./ListSelector.css"
import { DataComponent } from "../data/components/DataComponent";
import { U, engine } from "@/engine";
import { range } from "@/utils/utils";
import { Content } from "../data/Data";

type ListSelectorInfo<T extends DataComponent> = {
    datas:DataCollection<T> | T[],
    page?:number,
    capacity?:number,
    keyword?:string,
    componentBuilder: (info:{data:T}) => HTMLElement,
    filter: (data:T, search:string) => boolean,
    selection?: T,
    onInsert?: (name?:string) => void,
    onRemove?: (list:T[]) => void
}
function ListSelectorItem<T extends DataComponent>(info:{
    componentBuilder:(info:{data:T}) => HTMLElement,
    data:T,
    checked: boolean
}) {
    const comp = info.componentBuilder(info);
    comp.classList.add("item-center");

    return li()([
        inputText({class: "checkbox", type: "checkbox", checked: U(() => info.checked), onchange: e => info.checked = (<HTMLInputElement>e.target).checked})(),
        comp
    ])
}
export const ListSelector = <T extends DataComponent>($info:ListSelectorInfo<T>) => {
    $info.page = $info.page ?? 1;
    $info.capacity = $info.capacity ?? 20;
    $info.keyword = $info.keyword ?? "";

    const info = $info as Required<ListSelectorInfo<T>>;

    const itemInfos = (
        info.datas
            .filter(d => info.filter(d, info.keyword))
            .slice((info.page - 1) * info.capacity, info.page * info.capacity)
            .map(n => ({data: n, componentBuilder: info.componentBuilder, checked: false}))
    )
    const pairs = itemInfos.map(i => ({
        info: i,
        element: ListSelectorItem(i)
    }))

    function getMaxPage(){
        return Math.max(1, Math.ceil($info.datas.map(d => d).length / info.capacity))
    }

    function children() {
        const from = (info.page - 1) * info.capacity;
        const to = from + info.capacity;
        const datas = info.datas
            .filter(d => info.filter(d, info.keyword))
            .slice(from, to)

        if (datas.length > pairs.length) 
            pairs.push(...range(datas.length - pairs.length).map(_ => {
                const listInfo = {data: datas[0], componentBuilder: info.componentBuilder, checked: false}
                return {
                    info: listInfo,
                    element: ListSelectorItem(listInfo)
                }
            }))
        if (datas.length < pairs.length)
            pairs.splice(pairs.length + datas.length - pairs.length, pairs.length - datas.length)

        for (let i = 0; i < pairs.length; i++){
            pairs[i].info.data = datas[i];
        }

        return pairs.map(p => p.element)
    }

    return (
        div({class: "list-selector"})([
            div({class: "top-bar"})([ 
                inputText({
                    className: "search",
                    oninput: e => info.keyword = (<HTMLInputElement>e.target).value
                })(),
                btn({onclick: () => info.onInsert?.(info.keyword)})("+"),
                btn({onclick: () => {
                    info.onRemove?.(itemInfos.filter(i => i.checked).map(i => i.data))
                    itemInfos.forEach(i => i.checked = false)
                }})("-"),
                div({className: "page-controller"})([
                    btn({
                        class: "page-changer", 
                        onclick: () => info.page--,
                        disabled: U(() => info.page <= 1)
                    })("<"),
                    span({class: "page-counter"})(() => `${info.page} / ${getMaxPage()}`),
                    btn({
                        class: "page-changer", 
                        onclick: () => info.page++,
                        disabled: U(() => info.page >= getMaxPage())
                    })(">")
                ]),
                select({
                    className: "capacity",
                    onchange: e => info.capacity = Number((<HTMLInputElement>e.target).value)
                })([
                    option({value: '5'})("5"),
                    option({value: '10'})("10"),
                    option({value: '15'})("15"),
                    option({value: '20', selected: true})("20"),
                    option({value: '30'})("30"),
                    option({value: '50'})("50")
                ])
            ]),
            ul({className: "list"})(children),
        ])
    );
}