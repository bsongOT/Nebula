import { one, Repeat, U, Updated } from "@/engine";
import { Attribute, button, div, h1, h2, hr, inputText, span } from "@/funcObject";
import context from "../context";
import { Content, Nebula } from "../../backend/data/Data";
import { receiveMessage } from "../utils/utils";
import { TreeNode } from "@/data-structure/tree";

export function NoticePage(){
    let selectedOption = "isolated-content" as "isolated-content" | "isolated-nebula" | "status" | "routine";

    const style:Attribute<"div">["inlineStyle"] = U(() => ({
        display: context.popupPage === "notice" ? "flex" : "none"
    }))
    const sideTitleStyle = {
        padding: "10px"
    }
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
                div({
                    inlineStyle: {
                        padding: "15px",
                        background: "wheat",
                        width: "150px"
                    }
                })(
                    h2({inlineStyle: sideTitleStyle})("알림"),
                    div({
                        inlineStyle: U(() => ({...sideMenuStyle, background: selectedOption === "isolated-content" ? "floralwhite" : ""})),
                        onclick: () => selectedOption = "isolated-content"
                    })(
                        span()("소속 없는 컨텐츠"),
                        span({inlineStyle: {
                            marginLeft: "auto",
                            background: "red",
                            color: "white",
                            padding: "0 3px",
                            borderRadius: "2px"
                        }})(() => context.data.notifications.isolatedContents.length + "")
                    ),
                    div({
                        inlineStyle: U(() => ({...sideMenuStyle, background: selectedOption === "isolated-nebula" ? "floralwhite" : ""})),
                        onclick: () => selectedOption = "isolated-nebula"
                    })(
                        span()("소속 없는 네뷸라"),
                        span({inlineStyle: {
                            marginLeft: "auto",
                            background: "red",
                            color: "white",
                            padding: "0 3px",
                            borderRadius: "2px"
                        }})(() => context.data.notifications.isolatedNebulas.length + "")
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
                    then: IsolatedNebulasPage()
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
                })("현재 네뷸라에 담기")
            )
        )
    )
}
function IsolatedNebulasPage(){
    return (
        div()(
            div()(Repeat(
                NoticeNebulaLine,
                () => context.data.notifications.isolatedNebulas.map(nebula => ({nebula}))
            )),
            div()(
                button()("새 유니버스에 담기"),
                button()("현재 유니버스에 담기")
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
    const style:Partial<HTMLElement["style"]> = {
        display: "flex"
    }
    return (
        div({
            inlineStyle: style,
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
function NoticeNebulaLine(info:{nebula:Nebula}){
    const style:Partial<HTMLElement["style"]> = {
        display: "flex"
    }
    return (
        div({inlineStyle: style})(
            inputText({type: "checkbox"})(),
            div()(() => info.nebula.name)
        )
    )
}