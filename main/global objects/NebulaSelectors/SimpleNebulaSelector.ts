import { btn, div, inputText, span, ul } from "@/funcObject";
import { UIManager } from "@/objects/UIManager";
import { DataCollection } from "../../data/DataCollection";
import { Nebula } from "../../data/Data";
import { selli } from "@/objects/UI/list/selli";
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
            items: new Array<HTMLLIElement>(),
            pageDecreaser: btn({class: "page-changer", onclick: () => this.info.page!--})("<"),
            pageCounter: span()(""),
            pageIncreaser: btn({class: "page-changer", onclick: () => this.info.page!++})(">")
        }
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
        this.layout.list.innerHTML = "";
        this.layout.items = this.info.nebulas.map(n => (
            selli()(
                span()(n.id.toString()),
                span()(n.name)
            )
        ))
        
        const from = (this.info.page - 1) * this.info.capacity;
        const to = from + this.info.capacity;
        const maxPage = Math.max(1, Math.ceil(this.layout.items.length / this.info.capacity))

        this.layout.list.append(...this.layout.items.slice(from, to))
        this.layout.pageCounter.innerText = `${this.info.page} / ${maxPage}`;

        this.layout.pageDecreaser.disabled = this.info.page <= 1;
        this.layout.pageIncreaser.disabled = this.info.page >= maxPage;
    }
    public detect() {
        if (this.layout.items.length !== this.info.nebulas.all().length){
            return true;
        }
        if (!this.layout.pageCounter.innerText.startsWith(this.info.page.toString())) return true;
        if (this.layout.capacity.value !== this.info.capacity?.toString()) return true;
        if (this.info.keyword !== this.layout.search.value) return true;
        return false;
    }
}