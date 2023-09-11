import { WebObject } from "..";
import { DraggableList } from "./DraggableList";
import { ListItem } from "./ListItem";

export class DraggableItem<T> extends ListItem<T, DraggableList<T>>{
  constructor(children?:WebObject<any,any>[]){
    super(children)
    this.onclick(()=>{
        
    })
  }
}