import { span, div, btn } from "@/funcObject";
import { Content } from "../../../data/Content"

function contentItem(content:Content){
  const parentsCount = content.parents.length.toString();
  const nebulasCount = content.nebulas.length.toString()

  return (
    sul(
      span(content.title),
      div(
        btn(parentsCount),
        btn(nebulasCount)
      ).class.add("list-item-backlink")
    )
  )
}