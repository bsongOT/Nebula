import { btn, div } from "@/funcObject"
import { CategoryNebula, CommonNebula, Content, Data, Nebula, QueryNebula } from "../data/Data";
import { TreeNode } from "@/data-structure/tree";
import { DataCollection } from "../data/DataCollection";
import { engine } from "@/engine";
import "./NebulaEditor.css"
import { CommonNebulaEditor } from "./CommonNebulaEditor";
import { CategoryNebulaEditor } from "./CategoryNebulaEditor";
import { QueryNebulaEditor } from "./QueryNebulaEditor";

export type NebulaEditorInfo = {
    openedNebulaInfos:{
        nebula: Nebula,
    }[],
    selection: {
        nebula?:Nebula
    }
}
export const NebulaEditor = (info:NebulaEditorInfo, data:Data) => {
    const openedTabs = new Array<{
        element: HTMLElement
        nebula: Nebula
    }>()
    
    engine.updater.register(() => {
        const shownTabNebulas = openedTabs.map(o => o.nebula);
        const dataTabNebulas = info.openedNebulaInfos.map(n => n.nebula)
        if (shownTabNebulas.length !== dataTabNebulas.length || 
            shownTabNebulas.some((v, i) => v !== dataTabNebulas[i])
        ){
            openedTabs.splice(0, openedTabs.length);
            openedTabs.push(...dataTabNebulas.map(n => ({
                element: div({}, {className: () => `opened-tab ${n === info.selection.nebula ? "selected" : ""}`.trim()})([
                    div()(n.name),
                    btn({class: "close-button"})("X")
                ]),
                nebula: n
            })))
        }

        if (!info.selection.nebula) return;
        if (info.openedNebulaInfos.map(i => i.nebula).includes(info.selection.nebula)) return;
        info.openedNebulaInfos.push({
            nebula: info.selection.nebula
        })
    })

    return div({class: "nebula-editor"})([
        div({class: "current-opened-tabs"})(() => openedTabs.map(t => t.element)),
        div()(
            () => {
                if (!info.selection.nebula) return [];
                if (info.selection.nebula instanceof CommonNebula) return [CommonNebulaEditor(info.selection as any, data)]
                if (info.selection.nebula instanceof CategoryNebula) return [CategoryNebulaEditor({nebula: info.selection.nebula, data: data})]
                if (info.selection.nebula instanceof QueryNebula) return [QueryNebulaEditor()]
                return []
            }
        )
    ])
}