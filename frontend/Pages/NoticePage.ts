import { one, Repeat, U, Updated } from "@/engine";
import { Attribute, button, div, h1, h2, hr, inputText, span } from "@/funcObject";
import context from "../context";
import { Content, Nebula } from "../../backend/data/Data";
import { receiveMessage } from "../utils/utils";
import { TreeNode } from "@/data-structure/tree";
import { Universe } from "../../backend/data/components/Universe";

export function NoticePage(){
    let selectedOption = "isolated-content" as "isolated-content" | "isolated-nebula" | "status" | "routine";
    const selectedNebulas = new Array<Nebula>();

    const style:Attribute<"div">["inlineStyle"] = U(() => ({
        display: context.popupPage === "notice" ? "flex" : "none"
    }))
    const sideMenuStyle = {
        padding: "5px 10px",
        borderRadius: "5px",
        transition: "0.2s",
        display: "flex"
    }
    return (
        div({class: "popup-page-wrapper", inlineStyle: style, onclick: () => context.popupPage = ""})(
            div({
                inlineStyle: {
                    width: "90%",
                    height: "90%",
                    background: "white",
                    filter: "drop-shadow(2px 2px 4px #aaa)",
                    borderRadius: "10px",
                    display: "flex",
                    overflow: "hidden"
                },
                onclick: e => e.stopPropagation()
            })(
                div({ class: "notice-side" })(
                    h2({ class: "notice-side-title" })("알림"),
                    div({
                        inlineStyle: U(() => ({...sideMenuStyle, background: selectedOption === "isolated-content" ? "floralwhite" : ""})),
                        onclick: () => selectedOption = "isolated-content"
                    })(
                        span()("소속 없는 컨텐츠"),
                        span({
                            class: U(() => context.data.notifications.isolatedContents.length === 0 ? "hidden" : "notice-side-item-count"),
                        })(() => context.data.notifications.isolatedContents.length + "")
                    ),
                    div({
                        inlineStyle: U(() => ({...sideMenuStyle, background: selectedOption === "isolated-nebula" ? "floralwhite" : ""})),
                        onclick: () => selectedOption = "isolated-nebula"
                    })(
                        span()("소속 없는 네뷸라"),
                        span({
                            class: U(() => selectedNebulas.length === 0 ? "hidden" : "notice-side-item-count")
                        })(() => context.data.notifications.isolatedNebulas.length + "")
                    ),
                    div({
                        inlineStyle: U(() => ({...sideMenuStyle, background: selectedOption === "status" ? "floralwhite" : ""})),
                        onclick: () => selectedOption = "status"
                    })("상태"),
                    div({
                        inlineStyle: U(() => ({...sideMenuStyle, background: selectedOption === "routine" ? "floralwhite" : ""})),
                        onclick: () => selectedOption = "routine"
                    })("루틴")
                ),
                div({inlineStyle: {padding: "15px", flexGrow: "1"}})(one([{
                    if: () => selectedOption === "isolated-content",
                    then: IsolatedContentsPage()  
                },{
                    if: () => selectedOption === "isolated-nebula",
                    then: IsolatedNebulasPage({selectedNebulas})
                },{
                    if: () => selectedOption === "status",
                    then: StatusPage()
                },{
                    if: () => selectedOption === "routine",
                    then: RoutinePage()
                }]))
            )
        )
    )
}
function IsolatedContentsPage(){
    let allSelect = true;
    return (
        div({inlineStyle: {height: "100%", display: "flex", flexDirection: "column"}})(
            div({inlineStyle: {overflow: "auto", flexGrow: "1"}})(
                div()(Repeat(
                    NoticeContentLine,
                    () => context.data.notifications.isolatedContents.map(content => ({content}))
                ))
            ),
            hr({inlineStyle: {marginLeft: "0", marginRight: "0"}})(),
            div({
                inlineStyle: {display: "flex"},
                onclick: () => {
                    if (allSelect) context.noticeSelectedContents = [...context.data.notifications.isolatedContents]
                    else context.noticeSelectedContents = [];
                    allSelect = !allSelect;
                }
            })(
                inputText({type: "checkbox", checked: U(() => !allSelect)})(),
                div({inlineStyle: {fontWeight: "bolder"}})(() => allSelect ? "전체 선택" : "선택 해제")
            ),
            div()(
                button({
                    class: "one-click-button",
                    onclick: async () => {
                        const nebulaName = await receiveMessage("새 네뷸라의 이름을 입력해주세요.")
                        if (nebulaName === "") return alert("네뷸라 이름은 빈 문자열일 수 없습니다.")
                        const neb = context.data.addNebula(new Nebula({name: nebulaName}));
                        for (const c of context.noticeSelectedContents) neb.tree.insert(new TreeNode(c));
                        context.noticeSelectedContents = [];
                    }
                })("새 네뷸라에 담기"),
                button({
                    class: "one-click-button",
                    onclick: () => {
                        const neb = context.selection.nebula;
                        if (!neb) return alert("현재 열려있는 네뷸라가 없습니다.");
                        const travel  = neb.tree.traverse().map(i => i.node.data);
                        const overlapFilteredContents = context.noticeSelectedContents.filter(c => !travel.includes(c));
                        for (const c of overlapFilteredContents) neb.tree.insert(new TreeNode(c))
                        if (context.noticeSelectedContents.length - overlapFilteredContents.length > 0) {
                            alert(`중복되는 ${context.noticeSelectedContents.length - overlapFilteredContents.length}개의 컨텐츠는 추가되지 않았습니다.`)
                        }
                        context.noticeSelectedContents = [];
                    }
                })("현재 네뷸라에 담기"),
                button({
                    class: "one-click-button delete-button",
                    onclick: () => {
                        context.noticeSelectedContents.forEach(c => context.data.removeContent(c));
                    }
                })("삭제")
            )
        )
    )
}
function IsolatedNebulasPage(info: {selectedNebulas:Nebula[]}){
    const { selectedNebulas } = info;
    return (
        div()(
            div()(Repeat(
                NoticeNebulaLine,
                () => context.data.notifications.isolatedNebulas.map(nebula => ({nebula, selectedNebulas}))
            )),
            div()(
                button({
                    class: "one-click-button",
                    onclick: () => {
                        const univ = context.data.universes.add(new Universe());
                        univ.nebulas.push(...selectedNebulas);
                        selectedNebulas.splice(0, selectedNebulas.length);
                    }
                })("새 유니버스에 담기"),
                button({
                    class: "one-click-button",
                    onclick: () => {
                        const univ = context.selection.universe;
                        if (!univ) return;
                        univ.nebulas.push(...selectedNebulas);
                        selectedNebulas.splice(0, selectedNebulas.length);
                    }
                })("현재 유니버스에 담기"),
                button({
                    class: "one-click-button delete-button",
                    onclick: () => {
                        selectedNebulas.splice(0, selectedNebulas.length);
                    }
                })("삭제")
            )
        )
    )
}
function StatusPage(){
    return (
        div()(
            div()(
                div()("원시성"),
                div()("주계열성"),
                div()("죽음")
            )
        )
    )
}
function RoutinePage(){
    return (
        div()()
    )
}
function NoticeContentLine(info:{content:Content}){
    return (
        div({
            class: "notice-content-line",
            onclick: () => {
                if (context.noticeSelectedContents.includes(info.content)) context.noticeSelectedContents = context.noticeSelectedContents.filter(c => c !== info.content);
                else context.noticeSelectedContents.push(info.content)
            }
        })(
            inputText({
                type: "checkbox", 
                checked: U(() => context.noticeSelectedContents.includes(info.content))
            })(),
            div()(() => info.content.title)
        )
    )
}
function NoticeNebulaLine(info:{nebula:Nebula, selectedNebulas:Nebula[]}){
    return (
        div({
            class: "notice-nebula-line",
            onclick: () => {
                if (info.selectedNebulas.includes(info.nebula)) {
                    info.selectedNebulas.splice(0, info.selectedNebulas.length);
                    info.selectedNebulas.push(...info.selectedNebulas.filter(n => n !== info.nebula));
                }
                else info.selectedNebulas.push(info.nebula)
            }
        })(
            inputText({
                type: "checkbox",
                checked: U(() => info.selectedNebulas.includes(info.nebula))
            })(),
            div()(() => info.nebula.name)
        )
    )
}