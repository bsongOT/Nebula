import { Repeat } from "@/engine";
import { div, span } from "@/funcObject";
import { Dust } from "../../../backend/data/components/Dust";
import context from "../../context";
import { LucideIcon } from "../../Components/utils/Icon";
import { CircleX } from "lucide";

export function ContentRuleMenu(info: {opened:boolean}){
    let prevDusts = [] as Dust[]
    return (
        div({class: "popup-page-wrapper", inlineStyle: {display: "none"}})(
            div({class: "popup-page"})(
                div()(
                    div()(
                        div({class: "context-menu-item"})(
                            div({inlineStyle: {display: "inline-block", borderRadius: "50%", background: "green", width: "6px", height: "6px"}})(),
                            span()("중복 금지")
                        ),
                        div()(
                            Repeat(
                                i => {
                                    return div({class: "context-menu-item", inlineStyle: {display: "flex", alignItems: "center"}})(
                                        span({inlineStyle: {color: "red", display: "inline-flex", marginRight: "5px"}})(LucideIcon(CircleX, 20)),
                                        span()(() => i.claim)
                                    )
                                },
                                () => {
                                    if (!context.selection.content) return [];
                                    const claimArray = context.selection.content.data.dusts.traverse().map(i => i.node.data.claim);
                                    const claimSet = [...new Set(claimArray)]
                                    return claimSet.filter(c => claimArray.filter(c2 => c2 === c).length >= 2).map(claim => ({claim}));
                                }
                            )
                        )  
                    ),
                    div()(
                        div()("삭제 금지")    
                    )
                )
            )
        )
    )
}