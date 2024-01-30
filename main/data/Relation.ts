import { Tree } from "../../engine/data-structure/tree";
import {Content} from "./Content"
import { data } from "./Data";
import { DataComponent } from "./DataComponent";

export class RelationTable {
    mainTree:Tree<Content>;
    secondTree:Tree<Content>;
    id:number;
    constructor(mainTree:Tree<Content>, secondTree:Tree<Content>, id:number){
        this.mainTree = mainTree;
        this.secondTree = secondTree;
        this.id = id;
    }
}
export class Relation implements DataComponent {
    first:Content;
    second:Content;
    id:number;
    constructor(first:Content, second:Content, id:number){
        this.first = first;
        this.second = second;
        this.id = id;
    }
    public static load(obj:any){
        let r = new Relation(
            data.contents.get(obj.first)!,
            data.contents.get(obj.second)!,
            obj.id
        )
        return r;
    }
    public pack(){
        const r = this;
        return {
            first: r.first.id,
            second: r.second.id,
            id: r.id
        }
    }
}