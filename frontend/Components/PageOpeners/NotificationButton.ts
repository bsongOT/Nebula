import { U } from "@/engine";
import { div, button, span, Attribute } from "@/funcObject";
import context from "../../context";
import { Icon } from "../utils/Icon";

export function NotificationButton(){
    const icon = Icon(`
      <path d="M9.268 18a2 2 0 0 0 5.464 0"/>
      <path d="M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326"/></svg>
    `)
    const buttonStyle:Attribute<"div">["inlineStyle"] = {
      position: 'relative',
      lineHeight: '17px'
    }
    const noticeNumberStyle:Attribute<"span">["inlineStyle"] = U(() => ({
      display: context.data.notifications.length <= 0 ? "none" : "",
      position: 'absolute',
      right: '12px',
      top: '0',
      translate: '50% 2px',
      borderRadius: '8.5px',
      background: 'red',
      minWidth: '11px',
      height: '17px',
      padding: "0 3px",
      color: 'white',
      fontSize: "11px",
      textAlign: "center",
      pointerEvents: "none"
    }))
    
    return (
      div({inlineStyle: buttonStyle})(
        button({ className: "button", onclick: () => context.popupPage = "notice" })(icon),
        span({ inlineStyle: noticeNumberStyle })(() => {
          const len = context.data.notifications.length;
          if (len < 100) return `${len}`;
          else return "99+";
        })
      )
    )
  }