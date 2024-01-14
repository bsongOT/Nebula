import { btn, div } from "@/funcObject";
import { WDetail, WButton } from "@/objects";
import { WCheckbox } from "@/objects/input/";
import { DraggableList, DraggableItem } from "@/objects/list";

const sortTool = () => (
  div(
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
  ).class.add("sort-tool")
)