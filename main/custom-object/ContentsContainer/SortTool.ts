import {ButtonObject, Text, Detail, DraggableItem, DraggableList} from "../"
import { Checkbox } from "../../../engine/objects/input/Checkbox";

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