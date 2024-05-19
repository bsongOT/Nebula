import { Coord } from "../../../engine/utils/math/coord-system";
import { Tree, TreeNode } from "../../../engine/data-structure/tree"
import { Content } from "../Data";
import { DataCollection } from "../DataCollection";
import { DataComponent } from "./DataComponent";
import { Dust } from "./Dust";

export abstract class Nebula implements DataComponent{
  id:number;
  name:string;

  constructor(info?:Partial<Nebula>){
    this.name = info?.name ?? "";
    this.id = info?.id ?? -1;
  }
}

export class CommonNebula extends Nebula {
  tree:Tree<Content>;
  palette:Content[];
  importerIds:number[];
  constructor(info?:Partial<CommonNebula>){
    super(info);
    this.palette = info?.palette ?? [];
    this.importerIds = info?.importerIds ?? [];
    this.tree = info?.tree ?? new Tree()
  }
}

export class CategoryNebula extends Nebula {
  ownerMap:{dust:Dust, content:Content}[];
  referenceContent:Content;
  referenceNebula:CommonNebula;
  constructor(info:Partial<CategoryNebula>){
    super(info);
    this.ownerMap = info.ownerMap ?? [];
    this.referenceContent = info.referenceContent ?? new Content();
    this.referenceNebula = info.referenceNebula ?? new CommonNebula();
  }
}

export class QueryCalculation {
  operator:"or" | "and" | "and not";
  nebula:Nebula;
  constructor(operator:"or"|"and"|"and not", nebula:Nebula){
    this.operator = operator;
    this.nebula = nebula
  }
}

export class QueryNebula extends Nebula {
  query:QueryCalculation[];
  constructor(info?:Partial<QueryNebula>){
    super(info);
    this.query = info?.query ?? []
  }
}