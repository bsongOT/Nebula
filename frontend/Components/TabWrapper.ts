import { Repeat, U, Updated } from "@/engine";
import { div, span } from "@/funcObject";
import context, {Selection} from "../context";
import { closeCurrentTab } from "../features";
import { Content } from "../../backend/data/Data";

export function TabWrapper() {

    return (
        div({ class: "tab-container" })(
            div({ class: "main-tab-container" })(
                Repeat(Tab, () => context.tabs.map(selection => ({selection})))
            ),
            div({ class: "second-tab-container" })(
                Repeat(SecondTab, () => context.secondTabs.map(selection => ({selection})))
            )
        )
    )
}
function Tab(info: {selection:Selection}) {
    return (
        div({
            className: U(() => context.selection === info.selection ? "tab selected" : "tab"),
            onclick: () => {
                context.selection = info.selection;
            }
        })(
            div()(() => info.selection.content?.data.title ?? info.selection.nebula?.name ?? info.selection.universe?.name ?? "Home"),
            div({ class: U(() => `tab-record ${context.selection === info.selection && context.isRecordingContent ? "" : "hidden"}`.trim()) })(),
            span({
                className: "tab-close-button",
                onclick: e => {
                    e.stopPropagation();
                    closeCurrentTab();
                }
            })("×")
        )
    )
}
function SecondTab(info: {selection:Required<Selection> & {file?:string}}){
    return (
        div({

        })(
            div()(() => info.selection.file ?? info.selection.content?.data.title ?? info.selection.nebula?.name ?? info.selection.universe?.name ?? "")
        )
    )
}