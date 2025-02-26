import { Attribute, div } from "@/funcObject";
import context from "../../context";
import { receiveMessage } from "../../utils/utils";
import { TreeNode } from "@/data-structure/tree";
import { Nebula } from "../../../backend/data/Data";
import { U } from "@/engine";

export function ContentContextMenu(info:{opened:boolean}){
    const contextMenuAttr:Attribute<"div"> = {
        class: "context-menu content-context-menu",
        inlineStyle: U(() => ({
            display: info.opened ? "" : "none"
        }))
    }

    const putIntoNewNebula = async () => {
        if (!context.selection.content) return;
        const nebulaName = await receiveMessage("새 네뷸라의 이름을 입력해주세요.");
        if (nebulaName === "") return;
        context.selection.universe = context.data.systemUniverse;
        context.selection.nebula = context.data.addNebula(new Nebula({name: nebulaName}))
        context.selection.nebula!.tree.insert(new TreeNode(context.selection.content.data))
    }

    document.addEventListener("click", () => {
        info.opened = false;
    })
    document.addEventListener("keydown", e => {
        if (e.code === "Escape") info.opened = false;
    })
    
    return (
        div(contextMenuAttr)(
            div({className: "context-menu-item hover-ddd", onclick: putIntoNewNebula})("새 네뷸라에 담기"),
            div({className: "context-menu-item hover-ddd", onclick: () => {
                if (!context.selection.content) return;
                context.data.removeContent(context.selection.content.data)
                context.selection.content = undefined;
            }
            })("삭제하기")
        )
    )
}