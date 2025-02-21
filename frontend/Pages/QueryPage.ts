import { U } from "@/engine";
+import { div } from "@/funcObject";
import context from "../context";

export function QueryPage(){
    return (
        div({class: "popup-page-wrapper", inlineStyle: U(() => ({display: context.popupPage === "query" ? "" : "none"}))})(
            div({class: "popup-page"})(

            )
        )
    )
}