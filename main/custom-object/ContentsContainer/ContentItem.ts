import { span, div, btn, sul, sli } from "@/funcObject";
import { Content } from "../../data/Content"

export function contentItem(content:Content){
  const parentsCount = content.parents.length.toString();
  const nebulasCount = content.nebulas.length.toString()

  return (
    sli({data: content})(
      span(content.title),
      div({class: "list-item-backlink"})(
        btn(parentsCount),
        btn(nebulasCount)
      )
    )
  )
}