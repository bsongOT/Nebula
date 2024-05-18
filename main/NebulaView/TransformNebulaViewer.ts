import { Tree } from "@/data-structure/tree";
import { div, ul, span, li } from "@/funcObject";
import { Content } from "../data/Data";
import { TreeList } from "./TreeList/StarTreeList";

export type transformNebulaKind = "Zettelkasten" | "Problem Solving" | "Inverse Concept"
export const TransformNebulaViewer = () => {
    const tree = new Tree<transformNebulaKind | Content>()
    return TreeList({startNode: tree.root, itemChildrenBuilder: d => {
        if (typeof d === 'string') return [ div({class: "reference-node"})(d) ]
        return [
            div()(d.title)
        ]
    }})
};
