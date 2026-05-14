import { U } from "@/engine";
import { div, button, span, Attribute } from "@/funcObject";
import context from "../../context";
import { Icon } from "../utils/Icon";

export function NotificationButton(){
    const icon = Icon(`
      <path d="M9.268 18a2 2 0 0 0 5.464 0"/>
      <path d="M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326"/></svg>
    `)
    
    return (
      div({class: "action-opener"})(
        button({ className: "button", onclick: () => context.popupPage = "notice" })(icon),
        span({ className: U(() => context.data.notifications.length > 0 ? "action-notice" : "hidden")})(() => {
          const len = context.data.notifications.length;
          if (len < 100) return `${len}`;
          else return "99+";
        })
      )
    )
  }