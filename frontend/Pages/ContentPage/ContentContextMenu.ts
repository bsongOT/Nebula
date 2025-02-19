import { Attribute, div } from "@/funcObject";
import context from "../../context";
import { receiveMessage } from "../../utils/utils";
import { TreeNode } from "@/data-structure/tree";
import { Nebula } from "../../../backend/data/Data";

export function ContentContextMenu(){
    const contextMenuAttr:Attribute<"div"> = {
        inlineStyle: {
            display: "flex",
            flexDirection: "column",
            border: "1px solid #ddd",
            borderRadius: "5px",
            position: "absolute",
            top: "50px",
            right: "20px",
            background: "white",
            boxShadow: "2px 2px 4px #ccc"
        }
    }
    const menuStyle:Attribute<"div">["inlineStyle"] = {
        padding: "10px 15px"
    }

    const putIntoNewNebula = async () => {
        if (!context.selection.content) return;
        const nebulaName = await receiveMessage("새 네뷸라의 이름을 입력해주세요.");
        if (nebulaName === "") return;
        context.selection.universe = context.data.systemUniverse;
        context.selection.nebula = context.data.addNebula(new Nebula({name: nebulaName}))
        context.selection.nebula!.tree.insert(new TreeNode(context.selection.content.data))
    }
    
    return (
        div(contextMenuAttr)(
            div({className: "hover-ddd", inlineStyle: menuStyle, onclick: putIntoNewNebula})("새 네뷸라에 담기"),
            div({className: "hover-ddd", inlineStyle: menuStyle})("삭제하기")
        )
    )
}