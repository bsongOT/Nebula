import { ul } from "@/funcObject";

export class DraggableList {
    public readonly element;
    public readonly info;

    constructor(attrs:{
        children:HTMLLIElement[],
        onDragStart?:()=>void,
        onDragging?:()=>void,
        onDragEnd?:()=>void
    }){
        this.element = ul()()
        this.info = attrs;
    }
}