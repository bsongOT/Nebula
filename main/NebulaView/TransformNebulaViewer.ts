import { Tree } from "@/data-structure/tree";
import { div, ul, span, li } from "@/funcObject";
import { Content } from "../data/Data";

export type transformNebulaKind = "Zettelkasten" | "Problem Solving" | "Inverse Concept"
export const TransformNebulaViewer = () => {
    const tree = new Tree<transformNebulaKind | Content>()
    return TreeList({tree})
};
