import { div, button, Attribute, span } from "@/funcObject";
import { Icon } from "../utils/Icon";
import context from "../../context";
import { U } from "@/engine";

export function ClipboardButton() {
    const icon = Icon(`
      <path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/>
      <polyline points="22 12 16 12 14 15 10 15 8 12 2 12"/>
    `);
    const buttonStyle:Attribute<"div">["inlineStyle"] = {
        position: 'relative',
        lineHeight: '17px'
      }
    const noticeNumberStyle:Attribute<"span">["inlineStyle"] = U(() => ({
        display: context.clipboardLists.length <= 0 ? "none" : "",
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
            button({ 
                className: "button", 
                onclick: e => {
                    if (e.ctrlKey || e.metaKey){
                        if (context.selection.content) {
                            if (context.clipboardLists.content.includes(context.selection.content)) return;
                            return context.clipboardLists.content.push(context.selection.content);
                        }
                        if (context.selection.nebula) {
                            if (context.clipboardLists.nebula.includes(context.selection.nebula)) return;
                            return context.clipboardLists.nebula.push(context.selection.nebula);
                        }
                        if (context.selection.universe) {
                            if (context.clipboardLists.universe.includes(context.selection.universe)) return;
                            return context.clipboardLists.universe.push(context.selection.universe);
                        }
                    }
                    else {
                        context.popupPage = "clipboard"
                    }
                }
            })(icon),
            span({ inlineStyle: noticeNumberStyle })(() => {
                const len = context.clipboardLists.length;
                if (len < 100) return `${len}`;
                else return "99+";
            })
        )
    )
}