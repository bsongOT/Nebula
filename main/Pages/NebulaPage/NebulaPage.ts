import { btn, button, div, li, ul } from "@/funcObject";
import { Content, Nebula } from "../../data/Data";
import { TreeNode } from "@/data-structure/tree";
import { StarTreeList } from "./TreeList/StarTreeList";
import { range } from "@/utils/utils";
import { ListSelector } from "../../ListSelector/ListSelector";
import context from "../../context";
import "./NebulaPage.css"

export type CommonNebulaEditorInfo = {
    selectedNode?:TreeNode<Content>
}
export const NebulaPage = (info: CommonNebulaEditorInfo) => {
    const importerPairs = new Array<{
        element: HTMLLIElement,
        info: {nebula: Nebula}
    }>();
    let selectedContents = new Array<Content>();

    const isolatedImporter = li()([
        btn()("Isolated"),
        btn({class: "importer-arrow"})()
    ])
    const randomImporter = li()([
        btn()("Random"),
        btn({class: "importer-arrow"})()
    ])
    const importerAdder = li({class: "importer-adder"})([
        btn()("+")
    ])

    function importerItems() {
        if (importerPairs.length > context.importers.length){
            importerPairs.splice(0, importerPairs.length - context.importers.length)
        }
        else if (importerPairs.length < context.importers.length){
            importerPairs.push(
                ...range(context.importers.length - importerPairs.length)
                   .map(() => {
                    const info = {
                        nebula: new Nebula()
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
            importerPairs[i].info.nebula = context.importers[i];
        }
        return [
            isolatedImporter,
            randomImporter,
            ...importerPairs.map(ip => ip.element),
            importerAdder
        ];
    }

    function putIntoNebula() {
        if (!context.selection.nebula) return;
        const tree = context.selection.nebula.tree;
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

    return (
        div({ class: "nebula-page" })([
            ul({ class: "nebula-importer-list" })(importerItems),
            div({ class: "nebula-model" })(), //NebulaModel(info)
            div({ class: "tree-import-map" })([
                btn({ class: "nebula-palette-opener" })("Palette"),
                btn({ class: "importer-arrow", onclick: putIntoNebula })(),
                btn({ class: "nebula-destination"})(() => context.selection.nebula?.name ?? "")
            ]),
            StarTreeList(info)
        ])
    );
};
