import { btn, div } from "@/funcObject";
import { WCheckbox } from "@/objects/input/";
import { DraggableList, DraggableItem } from "@/objects/list";

const sortTool = () => (
  div({class: "sort-tool"})(
    btn("Sort"),
    new DraggableList([
      new DraggableItem([
        new WCheckbox().label("가나다순")
      ]),
      new DraggableItem([
        new WCheckbox().label("생성일자순")
      ]),
      new DraggableItem([
        new WCheckbox().label("수정일자순")
      ])
    ])
  )
)