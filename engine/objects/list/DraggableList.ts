import { DraggableItem } from "./DraggableItem";
import { ListView } from "./ListView";

export class DraggableList<T> extends ListView<T, DraggableItem<T>>{
    private draggee:DraggableItem<T>|undefined;
    public constructor(children?:DraggableItem<T>[]){
        super(children)
    }
}