import { btn, div } from "@/funcObject"
import { Content, Nebula } from "../data/Data";
import { TreeNode } from "@/data-structure/tree";
import { DataCollection } from "../data/DataCollection";

export type NebulaEditorInfo = {
    openedNebulaInfos:{
        nebula: Nebula,
        
    }[], 
    shownNebula?:Nebula
}
export const NebulaEditor = (info:NebulaEditorInfo, data:{contents:DataCollection<Content>, nebulas:DataCollection<Nebula>}) => {
    function openedTabs(){
        return info.openedNebulaInfos.map(ni => div()([
            div()(ni.nebula.name),
            btn({class: "close-button"})("X")
        ]))
    }

    return div()([
        div({class: "current-opened-tabs"})(openedTabs)
    ])
}