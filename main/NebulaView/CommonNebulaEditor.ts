import { btn, button, div, li, ul } from "@/funcObject";
import { CommonNebula, Content, Nebula } from "../data/Data";
import { engine } from "@/engine";
import { TreeNode } from "@/data-structure/tree";
import { NebulaPalette } from "./NebulaPalette/NebulaPalette";
import { DataCollection } from "../data/DataCollection";
import { NebulaModel } from "./NebulaModel/NebulaModel";
import { StarTreeList } from "./TreeList/StarTreeList";
import { range } from "@/utils/utils";

export type CommonNebulaEditorInfo = {
    nebula:CommonNebula,
    selectedNode?:TreeNode<Content>,
}
export const CommonNebulaEditor = (info: CommonNebulaEditorInfo, data: { contents: DataCollection<Content>; nebulas: DataCollection<Nebula>; }) => {
    const importerPairs = new Array<{
        element: HTMLLIElement,
        info: {nebula: Nebula}
    }>();
    let selectedContents = new Array<Content>();

    function importerItems() {
        if (importerPairs.length > info.nebula.importers.length){
            importerPairs.splice(0, importerPairs.length - info.nebula.importers.length)
        }
        else if (importerPairs.length < info.nebula.importers.length){
            importerPairs.push(
                ...range(info.nebula.importers.length - importerPairs.length)
                   .map(() => {
                    const info = {
                        nebula: new CommonNebula()
                    }
                    return {
                        element: li()([
                            button()(() => info.nebula.name),
                            btn({ class: "importer-arrow" })()
                        ]),
                        info: info
                    }}
                )
            );
        }
        for (let i = 0; i < importerPairs.length; i++){
            importerPairs[i].info.nebula = info.nebula.importers[i];
        }
        return [
            ...importerPairs.map(ip => ip.element)
        ];
    }

    function putIntoNebula() {
        if (!info.nebula) return;
        const tree = info.nebula.tree;
        const nodes = selectedContents.map(c => new TreeNode(tree, c));

        for (const n of nodes) {
            tree.insert(n, info.selectedNode);
        }
    }

    function updent() {
    }
    function downdent() {
    }
    function outdent() {
    }
    function indent() {
    }

    return div()([
        div({ class: "tree-import-map" })([
            ul({ class: "nebula-importer-list" })(importerItems),
            btn({ class: "nebula-palette-opener" })("Palette"),
            btn({ class: "importer-arrow", onclick: putIntoNebula })(),
            btn({ class: "nebula-destination" }, { innerText: () => info.nebula.name })()
        ]),
        NebulaPalette(data, info),
        StarTreeList(info),
        div({ class: "arrow-keys" })([
            btn({ class: "up-arrow", onclick: updent })("위"),
            btn({ class: "left-arrow", onclick: outdent })("왼"),
            btn({ class: "down-arrow", onclick: downdent })("밑"),
            btn({ class: "right-arrow", onclick: indent })("오")
        ]),
        //NebulaModel(info)
    ]);
};
