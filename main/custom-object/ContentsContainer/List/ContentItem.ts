import { WText, WContainer, WButton } from "@/objects"
import { Content } from "../../../data/Content"
import { SelectableItem } from "@/objects/list";

export class ContentItem extends SelectableItem<Content> {
  constructor(content:Content) {
    super([
      new WText(content.title),
      new WContainer([
        new WButton(content.parents.length.toString()),
        new WButton(content.nebulas.length.toString())
      ]).class.add("list-item-backlink")
    ]);
    this.value = content;
  }
}