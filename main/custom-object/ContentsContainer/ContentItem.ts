import {Container, ButtonObject, SelectableItem} from "../index"
import {Content} from "../../data/Content"

export class ContentItem extends SelectableItem<Content> {
  constructor(content:Content) {
    super({}, [
      new Container({value: content.title}),
      new Container({class: "list-item-backlink"},
      [
        new ButtonObject(content.parents.length.toString()),
        new ButtonObject(content.nebulas.length.toString())
      ])
    ]);
    this.value = content;
  }
}