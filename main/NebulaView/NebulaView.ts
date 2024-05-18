import { btn, div, li } from "@/funcObject"
import { Content, Nebula } from "../data/Data";
import { engine } from "@/engine";
import { TreeNode } from "@/data-structure/tree";
import { NebulaPalette } from "./NebulaPalette/NebulaPalette";
import { DataCollection } from "../data/DataCollection";
import { NebulaModel } from "./NebulaModel/NebulaModel";
import { StarTreeList } from "./TreeList/StarTreeList";

export type NebulaWindowInfo = {
    shownNebula?:Nebula,
    selectedNode?:TreeNode<Content>,
}
export const NebulaWindow = (info:NebulaWindowInfo, data:{contents:DataCollection<Content>, nebulas:DataCollection<Nebula>}) => {
    const importerItems = new Array<HTMLLIElement>()
    let selectedContents = new Array<Content>()

    if (!info.shownNebula) return div()()

    engine.updater.register(() => {
        if (!info.shownNebula) return;
        importerItems.splice(0, importerItems.length);
        importerItems.push(...info.shownNebula.importerIds.map(id => li()([
            btn()(data.nebulas.get(id)?.name),
            btn({class: "importer-arrow"})("")
        ])));
    })

    function putIntoNebula() {
        if (!info.shownNebula) return;
        const tree = info.shownNebula.tree;
        const nodes = selectedContents.map(c => new TreeNode(tree, c))

        for (const n of nodes) {
            tree.insert(n, info.selectedNode)
        }
    }

    function updent(){

    }
    function downdent(){

    }
    function outdent(){

    }
    function indent(){

    }

    return div()([
        div({class: "tree-import-map"})([
            div({class: "nebula-importer-list"})(importerItems),
            btn({class: "nebula-palette-opener"})("Palette"),
            btn({class: "importer-arrow", onclick: putIntoNebula})(""),
            btn({class: "nebula-destination"}, {innerText: () => info.shownNebula!.name})("")
        ]),
        NebulaPalette(data, info as Required<NebulaWindowInfo>),
        StarTreeList(info as Required<NebulaWindowInfo>),
        div({ class: "arrow-keys" })([
            btn({ class: "up-arrow", onclick: updent })("위"),
            btn({ class: "left-arrow", onclick: outdent })("왼"),
            btn({ class: "down-arrow", onclick: downdent })("밑"),
            btn({ class: "right-arrow", onclick: indent })("오")
        ]),
        NebulaModel(info as Required<NebulaWindowInfo>)
    ])
}
export type NebulaViewInfo = {
    openedNebulaInfos:{
        nebula: Nebula,

    }[], 
    shownNebula?:Nebula
}
export const NebulaView = (info:NebulaViewInfo, data:{contents:DataCollection<Content>, nebulas:DataCollection<Nebula>}) => {
    const openedTabs = new Array<HTMLDivElement>();

    engine.updater.register(()=>{
        openedTabs.splice(0, openedTabs.length)
        openedTabs.push(...info.openedNebulaInfos.map(ni => div()([
            div()(ni.nebula.name),
            btn({class: "close-button"})("X")
        ])))
    })

    return div()([
        div({class: "current-opened-tabs"})(openedTabs),
        NebulaWindow(info, data)
    ])
}