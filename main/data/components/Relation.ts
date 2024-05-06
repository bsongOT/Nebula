import { Tree } from "../../../engine/data-structure/tree";
import {Content} from "./Content"
import { Dust } from "./Dust";
import { Nebula } from "./Nebula";

export const enum RelationState {
  none = -1
}

export class Relation {
    id:number
    mainTree:Nebula;
    secondTree:Nebula;
    table:{
        main: Content,
        second: Content,
        state: number | Dust
    }[];
    constructor(){
        this.mainTree = new Nebula();
        this.secondTree = new Nebula()
        this.table = [];
        this.id = -1;
    }
}