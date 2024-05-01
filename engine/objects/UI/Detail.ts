import { div } from "@/funcObject";
import "../styles/Detail.css"

export class Detail {
  constructor(){
    
  }
}
export const detail = (toggle:HTMLButtonElement, content:HTMLElement) => {
  const obj = div({class: "detail detail-collapsed"})(
    toggle,
    content
  )

  toggle.classList.add("detail-toggle")
  content.classList.add("detail-content")

  let collapsed = true;
  let height = content.scrollHeight;

  toggle.addEventListener("click", () => {
    obj.classList.toggle("detail-collapsed")
    collapsed = obj.classList.contains("detail-collapsed")
  })

  setInterval(() => {
    if (collapsed) {
      content.style.maxHeight = "0"
      return;
    }
    const visibleSize = content.scrollHeight;

    content.style.height = "auto"
    content.style.maxHeight = `${visibleSize}px`
    content.style.height = `${Math.max(height, visibleSize)}px`

    height = visibleSize
  }, 50)

  return obj;
}