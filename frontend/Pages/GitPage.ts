import { U } from "@/engine";
import { button, div } from "@/funcObject";
import context from "../context";
import { Tree, TreeNode } from "@/data-structure/tree";

export function GitPage(){
    let tree = new Tree<{status: "dir" | "untracked" | "modified" | "deleted", name:string}>()
    return (
        div({ class: "popup-page-wrapper", inlineStyle: U(() => ({display: context.popupPage === "git" ? "" : "none"})) })(
            div({ class: "popup-page" })(
                button({onclick: () => window.electron.gitCommit()})("Commit"),
                div()(
                    () => {
                        window.electron.gitStatus().then(i => {
                            tree = new Tree();
                            for (const path of i.untracked){
                                let target = tree.root;
                                for (const pathPart of path.split("/")){
                                    target = target.children.find(c => c.data.name === pathPart) ?? tree.insert(new TreeNode({
                                        status: "untracked",
                                        name: pathPart
                                    }), target)
                                }
                            }
                            for (const path of i.modified){
                                let target = tree.root;
                                for (const pathPart of path.split("/")){
                                    target = target.children.find(c => c.data.name === pathPart) ?? tree.insert(new TreeNode({
                                        status: "modified",
                                        name: pathPart
                                    }), target)
                                }
                            }
                            for (const path of i.deleted){
                                let target = tree.root;
                                for (const pathPart of path.split("/")){
                                    target = target.children.find(c => c.data.name === pathPart) ?? tree.insert(new TreeNode({
                                        status: "deleted",
                                        name: pathPart
                                    }), target)
                                }
                            }
                        });
                        return tree.traverse().map(i => "\u00a0".repeat(i.depth * 3) + i.node.data.name + " (" + i.node.data.status[0] + ")").join("\n");
                    }
                )
            )
        )
    )
}