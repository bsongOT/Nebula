import { Repeat, U, Updated } from "@/engine";
import { button, div, inputText } from "@/funcObject";
import context from "../context";
import { Content, Nebula } from "../../backend/data/Data";

export function NoticePage(){
    const style:Updated<HTMLElement, Partial<HTMLElement["style"]>> = U(() => ({
        position: "fixed",
        left: "0",
        width: "100%",
        height: "100%",
        zIndex: "1",
        backdropFilter: "blur(5px) brightness(80%)",
        display: context.noticeOpened ? "" : "none"
    }))
    return (
        div({inlineStyle: style})(
            div({inlineStyle: {
                width: "90%",
                height: "90%",
                background: "white",
                position: "absolute",
                top: "5%",
                left: "5%",
                filter: "drop-shadow(2px 2px 4px #aaa)",
                borderRadius: "20px"
            }})(
                button({onclick: () => context.noticeOpened = false})("X"),
                div()(
                    div()("소속 없는 컨텐츠"),
                    div({inlineStyle: {display: "flex"}})(
                        inputText({type: "checkbox"})(),
                        div({inlineStyle: {color: "#aaa", fontSize: "12px"}})("전체 선택")
                    ),
                    div()(Repeat(
                        NoticeContentLine,
                        () => context.data.notifications.isolatedContents.map(content => ({content}))
                    ))
                ),
                div()(
                    div()("소속 없는 네뷸라"),
                    div()(Repeat(
                        NoticeNebulaLine,
                        () => context.data.notifications.isolatedNebulas.map(nebula => ({nebula}))
                    ))
                ),
                div()(
                    div()("상태"),
                    div()(
                        div()("원시성"),
                        div()("주계열성"),
                        div()("죽음")
                    )
                ),
                div()(
                    div()("루틴")
                )
            )
        )
    )
}
function NoticeContentLine(info:{content:Content}){
    const style:Partial<HTMLElement["style"]> = {
        display: "flex"
    }
    return (
        div({inlineStyle: style})(
            inputText({type: "checkbox"})(),
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