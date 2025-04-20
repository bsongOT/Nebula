import { Tree, TreeNode } from "@/data-structure/tree";
import { Content, Data, Nebula } from "../backend/data/Data";
import { Relation } from "../backend/data/components/Relation";
import { Universe } from "../backend/data/components/Universe";

export type Selection = {
    universe?: Universe,
    relation?: Relation,
    nebula?: Nebula,
    content?: TreeNode<Content>,
}
const context = {
    workspaces: await window.electron.getWorkspaces(),
    currentWorkspace: await window.electron.getWorkspace(),
    data: await Data.create(),
    tabs: new Array<Selection>(),
    selection: {} as Selection,
    secondSelection: undefined as Selection | undefined,
    screenSplit: false,
    contentPageViewMode: "edit" as "edit" | "kanban",
    openedFile: "",
    iframeOnload: "",
    currentNebulaPageNumber: 0,

    searchString: "",
    searchIndex: 0,
    
    popupPage: "" as "" | "notice" | "clipboard" | "query" | "random" | "git" | "search",
    currentPieceElement: undefined as HTMLElement | undefined,
    isSideActive: false,
    isOpenedPageNavigator: false,
    isRecordingContent: false,
    isTextFocused: false,
    isRenaming: false,
    scrollVisibleContentNodes: new Set<TreeNode<Content>>(),
    clipboardLists: {
        content: new Array<Content>(),
        nebula: new Array<Nebula>(),
        universe: new Array<Universe>(),
        get length(){
            return this.content.length + this.nebula.length + this.universe.length;
        }
    },
    waitingContents: new Array<TreeNode<Content>>(),
    noticeSelectedContents: new Array<Content>(),
    gitStatusTree: new Tree<{status: "dir" | "untracked" | "modified" | "deleted", name:string, path:string}>()
}

export default context;