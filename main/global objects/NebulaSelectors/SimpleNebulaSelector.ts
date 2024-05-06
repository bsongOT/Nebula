import { btn, div, inputText, li, span, ul } from "@/funcObject";
import { UIManager } from "@/objects/UIManager";
import { DataCollection } from "../../data/DataCollection";
import { Nebula } from "../../data/Data";
import "./simpleNebulaSelector.css"

type SimpleNebulaSelectorInfo = {
    nebulas:DataCollection<Nebula>,
    keyword: string,
    page:number,
    capacity:number
}
export class SimpleNebulaSelector extends UIManager {
    public readonly element;
    public readonly info;
    public readonly layout;
    
    private items;

    constructor(attributes:SimpleNebulaSelectorInfo){
        super();
        this.info = attributes;
        const memento = {
            capacity: {
                type: "number", 
                value: this.info.capacity.toString(), 
                onchange: () => this.info.capacity = Number(this.layout.capacity.value)
            },
            search: {
                oninput: ()=>this.info.keyword = this.layout.search.value
            }
        }
        this.layout = {
            capacity: inputText(memento.capacity)(),
            search: inputText(memento.search)(),
            list: ul({class: "nebula-list"})(),
            pageDecreaser: btn({
                class: "page-changer", 
                onclick: () => this.info.page-- 
            },{
                disabled: () => this.info.page <= 1,

            })("<"),
            pageCounter: span({},{
                innerText: () => `${this.info.page} / ${this.getMaxPage()}`
            })(""),
            pageIncreaser: btn({
                class: "page-changer", 
                onclick: () => this.info.page++
            },{
                disabled: () => this.info.page >= this.getMaxPage()
            })(">")
        }
        this.items = new Array<HTMLLIElement>(),
        this.element = div()(
            this.layout.search,
            this.layout.capacity,
            this.layout.list,
            div()(
              this.layout.pageDecreaser,
              this.layout.pageCounter,
              this.layout.pageIncreaser
            )
        );
        this.init();
    }
    public update() {
        if (this.items.length === this.info.nebulas.all().length) return;

        this.layout.list.innerHTML = "";
        this.items = this.info.nebulas.map(n => (
            li({onclick: e => (e.target as HTMLElement).classList.add("selected")})(
                span()(n.id.toString()),
                span()(n.name)
            )
        ))
        
        const from = (this.info.page - 1) * this.info.capacity;
        const to = from + this.info.capacity;

        this.layout.list.append(...this.items.slice(from, to))
    }
    private getMaxPage(){
        return Math.max(1, Math.ceil(this.items.length / this.info.capacity))
    }
}