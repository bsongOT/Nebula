import { ul } from "@/funcObject";

type SelectableListInfo = {
    min?:number,
    max?:number,
    selectedElements:HTMLLIElement[]
    children:HTMLLIElement[]
}
export function SelectableList(info:SelectableListInfo) {
    
    return ul()(info.children)
}