import { TreeNode } from "@/data-structure/tree";
import { Content, Data, Nebula } from "../backend/data/Data";
import { Relation } from "../backend/data/components/Relation";
import { Universe } from "../backend/data/components/Universe";

export type Selection = {
    universe?: Universe,
    relation?: Relation,
    nebula?: Nebula,
    content?: Content,
}
const context = {
    data: new Data(),
    tabs: new Array<Selection>(),
    selection: {} as Selection,
    secondSelection: undefined as Selection | undefined,
    screenSplit: false,
    selectedNebulas: new Set<Nebula>(),
    contentPage: {
        viewMode: "edit" as "edit" | "kanban"
    },
    openedFile: "",
    iframeOnload: "",
    currentNebulaPageNumber: 0,
    searching: false,
    searchString: "",
    noticeOpened: false,
    isSideActive: false,
    isOpenedPageNavigator: false,
    isRecordingContent: false,
    isTextFocused: false,
    scrollVisibleContentNodes: new Set<TreeNode<Content>>(),
    drageeStar: undefined as TreeNode<Content> | undefined,
    dragStartY: 0,
    dragProgress: 0,
    waitingContents: new Array<TreeNode<Content>>()
}

export default context;