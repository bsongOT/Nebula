import { ISelectable } from "../interfaces/ISelectable";

export class SelectableSpace<T extends ISelectable>{
    private list:T[];
    private $selection:T|undefined;
    public get selection():T|undefined{
        return this.$selection;
    }
    public set selection(v:T|undefined){
        for (let i of this.list){
            i.selected = i === v;
        }
        this.$selection = v;
    }
    constructor(){
        this.list = [];
    }
    public regist(one:T){
        this.list.push(one);
    }
}