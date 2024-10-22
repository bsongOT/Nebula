import { TreeNode } from "@/data-structure/tree";
import { Repeat, U } from "@/engine";
import { div, ul, li, btn } from "@/funcObject";
import context from "../../context";
import { Content } from "../../data/Data";

export function NestingList(){
    let selectedNode = undefined as TreeNode<Content> | undefined;
    document.addEventListener("keydown", e => {
        if (!selectedNode) return;
        if (!context.selection.nebula) return;
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
        }
    })
    return (
        div()([
            ul({
                inlineStyle: {background: "white", margin: "0", padding: "0 2px 2px 2px", display: "flex", flexDirection: "column-reverse"}
            })(Repeat(
                (i:{depth: number, node: TreeNode<Content>}) => {
                    const scrollObserver = new IntersectionObserver((e) => {
                        if (e[0].isIntersecting) context.scrollVisibleContentNodes.add(i.node);
                        else context.scrollVisibleContentNodes.delete(i.node);
                    })
                    const elt =  (
                        li({
                            inlineStyle: U((item) => {
                                const isFixed = i.node.children.some(c => context.scrollVisibleContentNodes.has(c));
                                
                                return {
                                    paddingLeft: `${i.depth * 10}px`,
                                    listStyle: "none",
                                    background: selectedNode === i.node ? "skyblue" : "white",
                                    position: isFixed ? "sticky" : "",
                                    top: isFixed ? `${i.depth * (item.scrollHeight - 0.5)}px` : "",
                                }
                            }),
                            onclick: () => {
                                selectedNode = i.node;
                                context.selection.content = i.node.data;
                            },
                            className: U(() => {
                                return ""
                            })
                        })(() => i.node.data.title)
                    )
                    scrollObserver.observe(elt);
                    return elt
                },
                () => {
                    if (!context.selection.nebula) return []
                    const tree = context.selection.nebula.tree;
                    const arr = new Array<{depth: number, node: TreeNode<Content>}>()
                    tree.tourNode(tree.root, (n, d) => arr.push({depth: d, node: n}))
                    return arr.reverse()
                }
            ))
        ])
    )
}