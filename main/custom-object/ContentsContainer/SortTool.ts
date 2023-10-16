import { Detail, ButtonObject, Text } from "@/objects";
import { Checkbox } from "@/objects/input/";
import { DraggableList, DraggableItem } from "@/objects/list";

export class SortTool extends Detail{
  constructor(){
    super([
      new ButtonObject("Sort"),
      new DraggableList([
        new DraggableItem([
          new Checkbox(),
          new Text("가나다순")
        ]),
        new DraggableItem([
          new Checkbox(),
          new Text("생성일자순")
        ]),
        new DraggableItem([
          new Checkbox(),
          new Text("수정일자순")
        ])
      ])
    ]);
    this.addClass("sort-tool");
  }
}