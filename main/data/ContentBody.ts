import {Tree} from "../../engine/data-structure/tree"
import { Dust } from "./Dust";

export class ContentBody{
  claimTree:Tree<Dust>;
  
  constructor(){
    this.claimTree = new Tree<Dust>()
  }
}