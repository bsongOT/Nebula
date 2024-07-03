import { btn, div } from "@/funcObject";
import "../styles/Detail.css"

type DetailInfo = {
  content: HTMLElement
  collapsed: boolean
}

export function Details(info:DetailInfo){
  let height = 0;
  
  () => {
    const visibleSize = info.content.scrollHeight;

    info.content.style.height = "auto";
    info.content.style.height = `${Math.max(height, visibleSize)}px`;

    height = visibleSize;

    return {
      maxHeight: info.collapsed ? "0" : `${visibleSize}px`
    }
  }

  return div({class: "detail collapsed"})([
    btn({class: "toggle", onclick: () => info.collapsed = !info.collapsed})(),
    info.content
  ])
}