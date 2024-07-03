import { btn, div, inputText, li, span, ul } from "@/funcObject";
import { DataCollection } from "../data/DataCollection";
import "./ListSelector.css"
import { DataComponent } from "../data/components/DataComponent";
import { U, engine } from "@/engine";

type ListSelectorInfo<T extends DataComponent> = {
    datas:DataCollection<T> | T[],
    page?:number,
    capacity?:number,
    keyword?:string,
    itemChildrenBuilder: (data:T) => HTMLElement[],
    filter: (data:T, search:string) => boolean,
    selection?: T
}
export const ListSelector = <T extends DataComponent>($info:ListSelectorInfo<T>) => {
    $info.page = $info.page ?? 1;
    $info.capacity = $info.capacity ?? 20;
    $info.keyword = $info.keyword ?? "";

    const info = $info as Required<ListSelectorInfo<T>>;


    let pairs = new Array<{element:HTMLLIElement, data:T}>()
    let children = new Array<HTMLElement>();

    function getMaxPage(){
        return Math.max(1, Math.ceil(pairs.length / info.capacity))
    }
    function mustUpdate(datas:T[]){
        if (pairs.length !== datas.length) return true;
        if (datas.some((v, i) => v !== pairs[i].data)) return true;
        return false;
    }

    engine.updater.register(() => {
        const datas = info.datas instanceof DataCollection ? info.datas.all() : info.datas;
        if (!mustUpdate(datas)) return;
        
        const from = (info.page - 1) * info.capacity;
        const to = from + info.capacity;

        pairs = info.datas.map(n => ({
            element: li({className: U(() => info.selection === n ? "selected" : "")})(info.itemChildrenBuilder(n)),
            data: n
        }))

        children = pairs
            .filter(p => info.filter(p.data, info.keyword))
            .slice(from, to)
            .map(p => p.element)
    })

    return (
        div({class: "list-selector"})([
            inputText({
                oninput: e => info.keyword = (<HTMLInputElement>e.target).value
            })(),
            inputText({
                type: "number", 
                value: info.capacity.toString(), 
                onchange: e => info.capacity = Number((<HTMLInputElement>e.target).value)
            })(),
            div()(() => children),
            div()([
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
            ])
        ])
    );
}