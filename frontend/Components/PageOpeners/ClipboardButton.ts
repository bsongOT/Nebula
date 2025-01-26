import { div, button } from "@/funcObject";
import { Icon } from "../utils/Icon";

export function ClipboardButton() {
    const icon = Icon(`
      <path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/>
      <polyline points="22 12 16 12 14 15 10 15 8 12 2 12"/>
    `);

    return (
        div()(
            button({ className: "button" })(icon)
        )
    )
}