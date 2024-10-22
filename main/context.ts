import { TreeNode } from "@/data-structure/tree";
import { Content, Data, Nebula } from "./data/Data";
import { Relation } from "./data/components/Relation";
import { Universe } from "./data/components/Universe";

export type Selection = {
    universe?: Universe,
    relation?: Relation,
    nebula?: Nebula,
    content?: Content,
}
const context = {
    data: new Data(),
    tabs: new Array<Selection>(),
    selection: {
        universe: undefined as Universe | undefined,
        relation: undefined as Relation | undefined,
        nebula: undefined as Nebula | undefined,
        content: undefined as Content | undefined
    } as Selection,
    screenSplit: false,
    heldComponents: {
        content: new Array<{content: Content, selected: boolean}>(),
        nebula: new Array<Nebula>(),
        relation: new Array<Relation>(),
        universe: new Array<Universe>()
    },
    selectedNebulas: new Set<Nebula>(),
    contentPage: {
        viewMode: "edit" as "edit" | "kanban" | "page" | "document"
    },
    scrollVisibleContentNodes: new Set<TreeNode<Content>>(),
    drageeStar: undefined as TreeNode<Content> | undefined,
    dragStartY: 0,
    dragProgress: 0,
    waitingContents: new Array<TreeNode<Content>>()
}

export default context;