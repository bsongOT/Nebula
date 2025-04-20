import { Repeat, U } from "@/engine";
import { div, h2 } from "@/funcObject";
import context from "../context";
import { LucideIcon } from "../Components/utils/Icon";
import { CirclePlus } from "lucide";

export function QueryPage(){
    const query = new Array<{}>()
    return (
        div({class: "popup-page-wrapper", 
            onclick: () => {
                context.popupPage = "";
            },
            inlineStyle: U(() => ({display: context.popupPage === "query" ? "" : "none"}))})(
            div({class: "popup-page", onclick: e => e.stopPropagation()})(
                QueryPageSide(),
                QueryPageMain()
            )
        )
    )
}
function QueryPageSide(){
    const getQueries = function(){
        return context.data.queries.map(query => ({query}));
    }
    const addQuery = function(){

    }
    return (
        div({ class: "popup-side query-page-side" })(
            h2({ class: "popup-side-title" })("쿼리"),
            div()(
                Repeat(QueryPageSideItem, getQueries)
            ),
            div({ class: "query-page-side-adder", onclick: addQuery })(LucideIcon(CirclePlus))
        )
    )
}
function QueryPageSideItem(info:{query:{}}){
    return (
        div()(

        )
    )
}
function QueryPageMain(){
    return (
        div()(

        )
    )
}