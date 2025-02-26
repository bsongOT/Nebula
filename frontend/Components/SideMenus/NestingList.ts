import { TreeNode } from "@/data-structure/tree";
import { Repeat, U } from "@/engine";
import { div, ul, li, btn, Attribute } from "@/funcObject";
import context from "../../context";
import { Content } from "../../../backend/data/Data";

export function NestingList(){
    const attr:Attribute<"ul"> = {
        inlineStyle: {
            background: "white", 
            margin: "0", 
            padding: "0", 
            display: "flex",
            flexDirection: "column"
        },
        className: U(list => {
            const bcr = list.getBoundingClientRect();
            const scrollTop = 123 - bcr.top;
            let currentHeight = 0;
            for (const item of list.children){
                const itemt = item as HTMLElement;
                if (currentHeight + item.scrollHeight >= scrollTop && currentHeight - item.scrollHeight <= scrollTop + (list.parentElement?.clientHeight ?? 0)) itemt.dataset.scrollArea = 'true';
                else itemt.dataset.scrollArea = 'false';
                currentHeight += item.scrollHeight;
            }
            return ""
        })
    }
    document.addEventListener("keyup", e => {
        if (!context.selection.nebula) return;
        if (context.selection.nebula.id < 0) return;
        const selectedNode = context.selection.content
        if (!selectedNode) return;
        if (!context.isSideActive) return;
        const tree = context.selection.nebula.tree;
        switch (e.code){
            case "ArrowUp":{
                const left = selectedNode.leftFriend;
                if (!left) return;
                tree.insertAsRightFriend(selectedNode, left)
                return;
            }
            case "ArrowDown":{
                const right = selectedNode.rightFriend;
                if (!right) return;
                tree.insertAsLeftFriend(selectedNode, right)
                return;
            }
            case "ArrowRight":{
                const left = selectedNode.leftFriend;
                if (!left) return;
                tree.insert(selectedNode, left)
                return;
            }
            case "ArrowLeft":{
                const parent = selectedNode.parent;
                if (!parent) return;
                tree.insertAsRightFriend(parent, selectedNode);
                return;
            }
            case "Backspace":{
                tree.remove(selectedNode);
                return;
            }
        }
    })
    return (
        div({ inlineStyle: { width: "250px" } })(
            ul(attr)(Repeat(ContentItem,
                () => {
                    if (!context.selection.nebula) return []
                    const tree = context.selection.nebula.tree;
                    const arr = new Array<{depth: number, node: TreeNode<Content>}>()
                    tree.tourNode(tree.root, (n, d) => arr.push({depth: d, node: n}))
                    return arr
                }
            ))
        )
    )
}
function ContentItem(i:{depth: number, node: TreeNode<Content>}){
    function isDescendantInScrollArea(node:TreeNode<Content>):boolean{
        if (node.children.length === 0) return context.scrollVisibleContentNodes.has(node);
        return node.children.some(c => isDescendantInScrollArea(c))
    }
    function background(isFixed:boolean){
        if (!context.selection.nebula) return "";

        if (context.selection.content === i.node) {
            if (context.isSideActive) return "skyblue";
            else return "#ccc";
        }
        if (isFixed) return "white";
        return "";
    }
    const attr:Attribute<"li"> = {
        inlineStyle: U((item) => {
            if (item.dataset.scrollArea === 'true') context.scrollVisibleContentNodes.add(i.node);
            else context.scrollVisibleContentNodes.delete(i.node);
            
            const isFixed = item.dataset.scrollArea === "false" && isDescendantInScrollArea(i.node);

            return {
                padding: `2px 0 2px ${10 + i.depth * 15}px`,
                listStyle: "none",
                background: background(isFixed),
                position: isFixed ? "sticky" : "",
                top: isFixed ? `${i.depth * (item.scrollHeight - 0.5)}px` : "",
                boxShadow: !context.scrollVisibleContentNodes.has(i.node) && i.node.children.some(c => context.scrollVisibleContentNodes.has(c))
                    ? "0 2px 2px #ccc" : ""
            }
        }),
        className: "hover-ccc",
        onclick: e => {
            if (i.node.data.id < 0) return;
            if (e.ctrlKey || e.metaKey) {
                context.secondSelection = {
                    universe: context.selection.universe,
                    nebula: context.selection.nebula,
                    content: i.node
                }
                context.tabs.push(context.secondSelection);
                context.screenSplit = true;
            }
            else context.selection.content = i.node;
        }
    }
    return (
        li(attr)(() => i.node.data.title)
    )
}