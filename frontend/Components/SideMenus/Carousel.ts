import { Repeat, U } from "@/engine";
import { Attribute, button, div, hr, span } from "@/funcObject";
import context from "../../context";
import { NestingList } from "./NestingList";
import { UniverseSelector } from "./UniverseSelector";
import { LucideIcon } from "../utils/Icon";
import { ChevronDown, CirclePlus, Database, Network, NotebookText } from "lucide";

export function Carousel() {
    let mode = "nebula" as "nebula" | "content"
    const attr:Attribute<"div"> = {
        class: "row",
        inlineStyle: U(() => ({
            left: {
                nebula: "0",
                content: "-100%"
            }[mode]
        }))
    }
    const modeChangerAttr:Attribute<"div"> = {
        inlineStyle: {
            display: "flex",
            flexDirection: "column",
            padding: "5px 0"
        }
    }
    const workspaceChangerAttr:Attribute<"div"> = {
        className: "left-side-mode-button hover-eee",
        onclick: e => {
            e.stopPropagation();
            isOpenedContextMenu = !isOpenedContextMenu;
        }
    }
    const nebulaModeButtonAttr:Attribute<"div"> = {
        className: "left-side-mode-button hover-eee", 
        onclick: () => mode = "nebula", 
        inlineStyle: U(() => ({
            background: mode === "nebula" ? "lightcoral" : "",
        }))
    }
    const contentModeButtonAttr:Attribute<"div"> = {
        className: "left-side-mode-button hover-eee", 
        onclick: () => mode = "content", 
        inlineStyle: U(() => ({
            background: mode === "content" ? "lightcoral" : "",
        }))
    }

    let isOpenedContextMenu = false;

    document.addEventListener("click", () => {
        isOpenedContextMenu = false
    });

    return (
        div({ class: "carousel" })(
            div(modeChangerAttr)(
                div(workspaceChangerAttr)(
                    span({ inlineStyle: {translate: "0 2px", display: "inline-block"} })(LucideIcon(Database)),
                    span({ inlineStyle: {marginLeft: "10px"} })("작업 공간"),
                    span({ inlineStyle: {marginLeft: "5px", translate: "0 3px", display: "inline-block"}})(LucideIcon(ChevronDown, 17))
                ),
                div({class: "workspace-context-menu", inlineStyle: U(() => ({display: isOpenedContextMenu ? "" : "none"}))})(
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
                        span({ inlineStyle: {translate: "0 2px", display: "inline-block", marginRight: "5px"} })(LucideIcon(CirclePlus)),
                        span()("추가하기")
                    )
                ),
                div(nebulaModeButtonAttr)(
                    span({ inlineStyle: {translate: "0 1px", display: "inline-block"} })(LucideIcon(Network)),
                    span({ inlineStyle: {marginLeft: "10px"} })("네뷸라")
                ),
                div(contentModeButtonAttr)(
                    span({ inlineStyle: {translate: "0 2px", display: "inline-block"} })(LucideIcon(NotebookText)),
                    span({ inlineStyle: {marginLeft: "10px"} })("컨텐츠")
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