import { Repeat, U } from "@/engine";
import { Attribute, button, div, hr, span } from "@/funcObject";
import context from "../../context";
import { NestingList } from "./NestingList";
import { UniverseSelector } from "./UniverseSelector";
import { LucideIcon } from "../utils/Icon";
import { ChevronDown, CirclePlus, Database, Network, NotebookText } from "lucide";

export function Carousel() {
    const attr:Attribute<"div"> = {
        class: "row",
        inlineStyle: U(() => ({
            left: {
                nebula: "0",
                content: "-100%"
            }[context.windowMode]
        }))
    }
    const nebulaModeButtonAttr:Attribute<"div"> = {
        className: U(() => "left-side-mode-button hover-eee" + (context.windowMode === "nebula" ? " selected" : "")), 
        onclick: () => context.windowMode = "nebula"
    }
    const contentModeButtonAttr:Attribute<"div"> = {
        className: U(() => "left-side-mode-button hover-eee" + (context.windowMode === "content" ? " selected" : "")), 
        onclick: () => context.windowMode = "content"
    }

    document.addEventListener("keydown", e => {
        if (e.code === "Escape"){
            context.isOpenedContextMenu = false;
        }
    })

    return (
        div({ class: "carousel" })(
            div({ class: "carousel-tab" })(
                WorkspaceChangeButton(),
                div({class: U(() => context.isOpenedContextMenu ? "workspace-context-menu" : "hidden")})(
                    div()(
                        context.workspaces.map(w => (
                            div({
                                class: "context-menu-item hover-eee",
                                onclick: async () => {
                                    context.data.stopSave();
                                    await window.electron.setWorkspace(w);
                                    location.reload()
                                }
                            })(w)
                        ))
                    ),
                    div({
                        class: "context-menu-item side-context-menu-item hover-eee",
                        onclick: async () => {
                            context.data.stopSave();
                            await window.electron.selectWorkspace();
                            location.reload();
                        }
                    })(
                        span({ class: "workspace-insert-icon" })(LucideIcon(CirclePlus)),
                        span()("추가하기")
                    )
                ),
                div(nebulaModeButtonAttr)(
                    span({ class: "nebula-mode-icon" })(LucideIcon(Network)),
                    span({ class: "left-side-button-text" })("네뷸라")
                ),
                div(contentModeButtonAttr)(
                    span({ class: "content-mode-icon" })(LucideIcon(NotebookText)),
                    span({ class: "left-side-button-text" })("컨텐츠")
                ),
                hr()()
            ),
            div(attr)(
                UniverseSelector(),
                NestingList()
            )
        )
    )
}
function WorkspaceChangeButton(){
    const workspaceChangerAttr:Attribute<"div"> = {
        className: "left-side-mode-button hover-eee",
        onclick: e => {
            e.stopPropagation();
            context.isOpenedContextMenu = !context.isOpenedContextMenu;
        }
    }

    document.addEventListener("click", () => {
        context.isOpenedContextMenu = false
    });

    return (
        div(workspaceChangerAttr)(
            span({ class: "workspace-icon" })(LucideIcon(Database)),
            span({ class: "left-side-button-text" })("작업 공간"),
            span({ class: "workspace-chevron" })(LucideIcon(ChevronDown, 17))
        )
    )
}