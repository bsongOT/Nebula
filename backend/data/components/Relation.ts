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
    /**
     * state가 null이면 메모할 필요 없는 비고려 대상임을 의미한다.
     */
    table:{
        main: Content,
        second: Content,
        state: Dust | null
    }[];
    constructor(info:Partial<Relation> & {mainTree:Nebula, secondTree:Nebula}){
        this.mainTree = info.mainTree;
        this.secondTree = info.secondTree;
        this.table = info.table ?? [];
        this.id = info.id ?? -1;
    }
}