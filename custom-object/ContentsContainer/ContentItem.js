import {Container, ButtonObject, SelectableItem} from "../../objects/index.js"

export class ContentItem extends SelectableItem {
  content;
  constructor(content) {
    super({}, [
      new Container({value: content.title}),
      new Container({class: "list-item-backlink"},
      [
        new ButtonObject(content.parents.length),
        new ButtonObject(content.nebulas.length)
      ])
    ]);
    this.content = content;
  }
  click() {
    this.parent.selection = this;
  }
}