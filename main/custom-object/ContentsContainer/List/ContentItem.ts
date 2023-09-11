import {Text, Container, ButtonObject, SelectableItem} from "../../index"
import {Content} from "../../../data/Content"

export class ContentItem extends SelectableItem<Content> {
  constructor(content:Content) {
    super([
      new Text(content.title),
      new Container([
        new ButtonObject(content.parents.length.toString()),
        new ButtonObject(content.nebulas.length.toString())
      ]).addClass("list-item-backlink")
    ]);
    this.value = content;
  }
}