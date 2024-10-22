import { Repeat, U } from "@/engine";
import { div, span } from "@/funcObject";
import context, {Selection} from "../context";

export function TabWrapper() {
    return (
        div({
            inlineStyle: {
                display: "flex"
            }
        })(Repeat(Tab, () => context.tabs))
    )
}
function Tab(info: Selection) {
    return (
        div({
            className: U(() => context.selection === info ? "tab selected" : "tab"),
            onclick: () => {
                context.selection = info;
            }
        })([
            div()(() => info.content?.title ?? info.nebula?.name ?? info.universe?.name ?? "Home"),
            span({
                inlineStyle: {
                    marginLeft: "5px"
                }
            })("×")
        ])
    )
}
