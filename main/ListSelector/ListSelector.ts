import { btn, div, inputText, li, span, ul } from "@/funcObject";
import { UIManager } from "@/objects/UIManager";
import { DataCollection } from "../data/DataCollection";
import "./ListSelector.css"
import { DataComponent } from "../data/components/DataComponent";
import { engine } from "@/engine";

type ListSelectorInfo<T extends DataComponent> = {
    datas:DataCollection<T> | T[],
    page:number,
    capacity:number,
    keyword:string,
    itemChildrenBuilder: (data:T) => HTMLElement[],
    filter: (data:T, search:string) => boolean,
    selection?: T
}
export const ListSelector = <T extends DataComponent>(info:ListSelectorInfo<T>) => {
    let pairs = new Array<{element:HTMLLIElement, data:T}>()
    let children = new Array<HTMLElement>();

    const getMaxPage = () => {
        return Math.max(1, Math.ceil(pairs.length / info.capacity))
    }

    engine.updater.register(() => {
        const datas = info.datas instanceof DataCollection ? info.datas.all() : info.datas;
        if (pairs.length === datas.length) return;
        if (datas.some((v, i) => v !== pairs[i].data)) return;
        
        const from = (info.page - 1) * info.capacity;
        const to = from + info.capacity;

        pairs = info.datas.map(n => ({
            element: li({}, {className: () => info.selection === n ? "selected" : ""})(info.itemChildrenBuilder(n)),
            data: n
        }))

        children = pairs
            .filter(p => info.filter(p.data, info.keyword))
            .slice(from, to)
            .map(p => p.element)
    })

    return div()([
        inputText({
            oninput: e => info.keyword = (<HTMLInputElement>e.target).value
        })(),
        inputText({
            type: "number", 
            value: info.capacity.toString(), 
            onchange: e => info.capacity = Number((<HTMLInputElement>e.target).value)
        })(),
        div()(children),
        div()([
            btn({
                class: "page-changer", 
                onclick: () => info.page-- },{
                disabled: () => info.page <= 1
            })("<"),
            span({class: "page-counter"},{
                innerText: () => `${info.page} / ${getMaxPage()}`
            })(""),
            btn({
                class: "page-changer", 
                onclick: () => info.page++ },{
                disabled: () => info.page >= getMaxPage()
            })(">")
        ])
    ]);
}
/*
export class ListSelector<T extends DataComponent> extends UIManager {
    public readonly element;
    public readonly info;
    public readonly layout;
    
    private pairs;

    constructor(attributes:ListSelectorInfo<T>){
        super();
        this.info = attributes;
        this.layout = {
            list: ul({class: "data-list"})()
        }
        this.pairs = new Array<{element:HTMLLIElement, data:T}>(),
        this.element = div()(
            inputText({
                oninput: e => this.info.keyword = (<HTMLInputElement>e.target).value
            })(),
            inputText({
                type: "number", 
                value: this.info.capacity.toString(), 
                onchange: e => this.info.capacity = Number((<HTMLInputElement>e.target).value)
            })(),
            this.layout.list,
            div()(
                btn({
                    class: "page-changer", 
                    onclick: () => this.info.page-- },{
                    disabled: () => this.info.page <= 1
                })("<"),
                span({class: "page-counter"},{
                    innerText: () => `${this.info.page} / ${this.getMaxPage()}`
                })(""),
                btn({
                    class: "page-changer", 
                    onclick: () => this.info.page++ },{
                    disabled: () => this.info.page >= this.getMaxPage()
                })(">")
            )
        );
        this.init();
    }
    public update() {
        const datas = this.info.datas instanceof DataCollection ? this.info.datas.all() : this.info.datas;
        if (this.pairs.length === datas.length) return;
        if (datas.some((v, i) => v !== this.pairs[i].data)) return;

        this.pairs = this.info.datas.map(n => ({
            element: li({}, {className: () => this.info.selection === n ? "selected" : ""})(...this.info.itemChildrenBuilder(n)),
            data: n
        }))
        
        const from = (this.info.page - 1) * this.info.capacity;
        const to = from + this.info.capacity;

        this.layout.list.innerHTML = "";
        this.layout.list.append(
            ...this.pairs
                .filter(p => this.info.filter(p.data, this.info.keyword))
                .slice(from, to)
                .map(p => p.element)
        )
    }
    private getMaxPage(){
        return Math.max(1, Math.ceil(this.pairs.length / this.info.capacity))
    }
}*/