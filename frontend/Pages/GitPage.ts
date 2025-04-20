import { Repeat, U } from "@/engine";
import { Attribute, button, div, h1, h2, inputText, span } from "@/funcObject";
import context from "../context";
import { Tree, TreeNode } from "@/data-structure/tree";

export function GitPage(){
    let lines = new Array<{state: "insert" | "delete", str:string, index:number}>()
    let commitMessage = "";
    let tab = "changes" as "changes" | "history";
    let commitHistory = new Array<{date:string, hash:string, message:string}>()
    let commitMessageFocused = false;
    const wrapperAttr:Attribute<"div"> = {
        class: "popup-page-wrapper", 
        inlineStyle: U(() => ({display: context.popupPage === "git" ? "" : "none"})),
        onclick: () => {
            context.popupPage = "";
        }
    }
    window.electron.gitCommitHistory().then(h => commitHistory = h);
    return (
        div(wrapperAttr)(
            div({ class: "popup-page", onclick: e => e.stopPropagation() })(
                div({inlineStyle: {width: "200px", borderRight: "1px solid #ddd", display: "flex", flexDirection: "column"}})(
                    h2({inlineStyle: {padding: "25px", paddingBottom: "10px"}})("Git"),
                    div({class: "git-page-tab-container"})(
                        div({
                            class: U(() => "git-page-tab" + (tab === "changes" ? " selected" : "")),
                            onclick: () => tab = "changes"
                        })("변경 사항"),
                        div({
                            class: U(() => "git-page-tab" + (tab === "history" ? " selected" : "")),
                            onclick: () => tab = "history"
                        })("히스토리")
                    ),
                    div({class: "git-page-side-main", inlineStyle: U(() => ({display: tab === "changes" ? "" : "none"}))})(
                        Repeat(
                            i => {
                                return (
                                    div({
                                        class: "hover-ddd",
                                        inlineStyle: U(() => ({
                                            paddingLeft: (10 + 20 * i.depth) + "px",
                                            display: "flex",
                                            color: {
                                                dir: "",
                                                untracked: "green",
                                                modified: "darkorange",
                                                deleted: "red"
                                            }[i.status]
                                        })),
                                        onclick: async () => {
                                            if (i.status === "dir") return;
                                            if (i.status === "untracked"){
                                                const filetext = await window.electron.read(i.path);
                                                lines = filetext.split("\n").map((l, i) => ({
                                                    state: "insert",
                                                    str: l,
                                                    index: i + 1
                                                }))
                                                return;
                                            }
                                            lines = await window.electron.gitDiffLines(i.path);
                                        }
                                    })(
                                        span({inlineStyle: {flexGrow: "1", overflowX: "hidden", textOverflow: "ellipsis", marginRight: "5px", textWrapMode: "nowrap"}})(() => i.name),
                                        span({inlineStyle: {marginRight: "25px"}})(() => i.status === "dir" ? "" : i.status[0].toUpperCase())
                                    )
                                )
                            },
                            () => {
                                return context.gitStatusTree.traverse().map(i => ({
                                    depth: i.depth,
                                    name: i.node.data.name,
                                    status: i.node.data.status,
                                    path: i.node.data.path
                                }));
                            }
                        )
                    ),
                    div({class: "git-page-side-main", inlineStyle: U(() => ({display: tab === "history" ? "" : "none"}))})(
                        Repeat(
                            i => {
                                return (
                                    div({
                                        class: "git-commit-history-item hover-eee",
                                        onclick: () => {
                                            alert("미구현입니다");
                                        }
                                    })(
                                        span({class: "git-commit-message"})(() => i.message),
                                        span({class: "git-hash"})(() => i.hash.slice(0, 5))
                                    )
                                )
                            },
                            () => commitHistory
                        )
                    ),
                    inputText({
                        class: "commit-message-input", 
                        placeholder: "commit message",
                        onfocus: () => commitMessageFocused = true,
                        onblur: () => commitMessageFocused = false,
                        oninput: function(){commitMessage = (this as HTMLInputElement).value},
                        value: U(text => {
                            if (commitMessageFocused) return text.value;
                            return commitMessage;
                        })
                    })(),
                    button({
                        class: "commit-button", 
                        onclick: async () => {
                            if (context.gitStatusTree.length === 0) return;
                            await window.electron.gitCommit(commitMessage)
                            commitHistory = await window.electron.gitCommitHistory();
                            commitMessage = "";
                            lines = [];
                            context.gitStatusTree = new Tree();
                        }
                    })("Commit")
                ),
                div({inlineStyle: {flexGrow: "1", overflow: "auto"}})(
                    Repeat(
                        i => {
                            return (
                                div({inlineStyle: {display: "flex"}})(
                                    span({
                                        inlineStyle: {
                                            paddingLeft: "5px",
                                            width: "50px",
                                            borderRight: "1px solid #ccc"
                                        }
                                    })(() => i.state !== "delete" ? "" : i.index + ""),
                                    span({
                                        inlineStyle: {
                                            paddingLeft: "5px",
                                            width: "50px",
                                            borderRight: "1px solid #ccc"
                                        }
                                    })(() => i.state === "delete" ? "" : i.index + ""),
                                    span({
                                        inlineStyle: U(() => ({
                                            background: {
                                                insert: "green",
                                                delete: "red"
                                            }[i.state],
                                            flexGrow: '1',
                                            wordBreak: "keep-all"
                                        }))
                                    })(() => i.str.replaceAll(" ", "\u00A0").replaceAll("\t", "\u00A0".repeat(5)))
                                )
                            )
                        },
                        () => lines
                    )
                )
            )
        )
    )
}