import { Tree } from "../../../engine/data-structure/tree";
import {Content} from "./Content"
import { Dust } from "./Dust";
import { CommonNebula, Nebula } from "./Nebula";

export const enum RelationState {
  none = -1
}

export class Relation {
    id:number
    mainTree:CommonNebula;
    secondTree:CommonNebula;
    table:{
        main: Content,
        second: Content,
        state: number | Dust
    }[];
    constructor(info:Partial<Relation> & {mainTree:CommonNebula, secondTree:CommonNebula}){
        this.mainTree = info.mainTree;
        this.secondTree = info.secondTree;
        this.table = info.table ?? [];
        this.id = info.id ?? -1;
    }
}