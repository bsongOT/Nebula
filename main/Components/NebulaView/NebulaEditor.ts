import { btn, div } from "@/funcObject"
import { CategoryNebula, CommonNebula, Content, Data, Nebula, QueryNebula } from "../../data/Data";
import { TreeNode } from "@/data-structure/tree";
import { DataCollection } from "../../data/DataCollection";
import { U, engine } from "@/engine";
import "./NebulaEditor.css"
import { CommonNebulaEditor, CommonNebulaEditorInfo } from "./CommonNebulaEditor";
import { CategoryNebulaEditor, CategoryNebulaEditorInfo } from "./CategoryNebulaEditor";
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
    const windowInfos = {
        common: {
            nebula: new CommonNebula({})
        } satisfies CommonNebulaEditorInfo,
        category: {
            nebula: new CategoryNebula({}),
            data: data
        } satisfies CategoryNebulaEditorInfo
    }
    const windows = {
        common: CommonNebulaEditor(windowInfos.common, data),
        category: CategoryNebulaEditor(windowInfos.category),
        query: QueryNebulaEditor()
    }
    const openedTabs = new Array<{
        element: HTMLElement
        nebula: Nebula
    }>()
    
    engine.updater.register(() => {
        if (info.selection.nebula){
            if (info.selection.nebula instanceof CommonNebula){
                windowInfos.common.nebula = info.selection.nebula
            }
            if (info.selection.nebula instanceof CategoryNebula){
                windowInfos.category.nebula = info.selection.nebula
            }
        }

        const shownTabNebulas = openedTabs.map(o => o.nebula);
        const dataTabNebulas = info.openedNebulaInfos.map(n => n.nebula)
        if (shownTabNebulas.length !== dataTabNebulas.length || 
            shownTabNebulas.some((v, i) => v !== dataTabNebulas[i])
        ){
            openedTabs.splice(0, openedTabs.length);
            openedTabs.push(...dataTabNebulas.map(n => ({
                element: div({className: U(() => `opened-tab ${n === info.selection.nebula ? "selected" : ""}`.trim())})([
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
                if (info.selection.nebula instanceof CommonNebula) return [windows.common]
                if (info.selection.nebula instanceof CategoryNebula) return [windows.category]
                if (info.selection.nebula instanceof QueryNebula) return [windows.query]
                return []
            }
        )
    ])
}