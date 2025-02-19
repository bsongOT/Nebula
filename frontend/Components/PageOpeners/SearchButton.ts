import { div, button, span } from "@/funcObject";
import { LucideIcon } from "../utils/Icon";
import { Search } from "lucide";

export function SearchButton(){
    return (
        div()(
            button({class: "button"})(
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