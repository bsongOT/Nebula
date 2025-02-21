import { div, button, span } from "@/funcObject";
import { LucideIcon } from "../utils/Icon";
import { Search } from "lucide";
import context from "../../context";

export function SearchButton(){
    return (
        div()(
            button({class: "button", onclick: () => {
                context.popupPage = "search";
            }})(
                span({ 
                    class: "material-symbols-outlined",
                    inlineStyle: {
                        fontSize: "30px",
                        fontWeight: "250"
                    }
                 })("search")
            )
        )
    )
}