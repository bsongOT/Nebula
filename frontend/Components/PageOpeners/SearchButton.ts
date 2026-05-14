import { div, button, span } from "@/funcObject";
import { Icon, LucideIcon } from "../utils/Icon";
import { Search } from "lucide";
import context from "../../context";

export function SearchButton(){
    const icon = Icon(`
        <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
        <circle cx="10" cy="10" r="6"></circle>
        <line x1="21" y1="21" x2="15" y2="15"></line>
    `)
    icon.setAttribute("stroke-width", "1.5px")
    icon.setAttribute("fill", "none");
    return (
        div({class: "action-opener"})(
            button({class: "button", onclick: () => {
                context.popupPage = "search";
            }})(
                icon
            )
        )
    )
}