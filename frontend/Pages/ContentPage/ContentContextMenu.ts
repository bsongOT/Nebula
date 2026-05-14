import { Attribute, div } from "@/funcObject";
import context from "../../context";
import { receiveMessage } from "../../utils/utils";
import { TreeNode } from "@/data-structure/tree";
import { Nebula } from "../../../backend/data/Data";
import { U } from "@/engine";
import { createNebulaByStart } from "../../features";

export function ContentContextMenu(info:{opened:boolean}){
    const contextMenuAttr:Attribute<"div"> = {
        class: "context-menu content-context-menu",
        inlineStyle: U(() => ({
            display: info.opened ? "" : "none"
        }))
    }

    document.addEventListener("click", () => {
        info.opened = false;
    })
    document.addEventListener("keydown", e => {
        if (e.code === "Escape") info.opened = false;
    })
    
    return (
        div(contextMenuAttr)(
            div({className: "context-menu-item hover-ddd", onclick: createNebulaByStart})("새 네뷸라에 담기"),
            div({className: "context-menu-item hover-ddd", onclick: () => {
                if (!context.selection.content) return;
                context.data.removeContent(context.selection.content.data)
                context.selection.content = undefined;
            }
            })("삭제하기")
        )
    )
}