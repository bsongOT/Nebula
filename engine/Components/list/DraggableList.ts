import { ul } from "@/funcObject";

type DraggableListInfo = {
    onDragStart?:()=>void,
    onDragging?:()=>void,
    onDragEnd?:()=>void
    children:HTMLLIElement[],
}
export function DraggableList(info:DraggableListInfo){
    return ul()(info.children)
}