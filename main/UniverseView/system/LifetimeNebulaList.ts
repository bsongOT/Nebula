import { div, li, span, ul } from "@/funcObject";
import { ListSelector } from "../../ListSelector/ListSelector";
import { Content, Data } from "../../data/Data";
import { engine } from "@/engine";


export const LifetimeNebulaList = (info: { data: Data; }) => {
  let listKind = "new" as "news" | "modifieds" | "livings" | "deads";
  const listInfo = {
    datas: new Array<Content>(),
    itemChildrenBuilder: (c: Content) => new Array<HTMLElement>()
  };
  engine.updater.register(() => {
    listInfo.datas = info.data.systemNebulas.lifetime[listKind];
    switch (listKind) {
      case "news":
        listInfo.itemChildrenBuilder = c => [
          span({ class: "new-content-mark" })(""),
          span()(c.title)
        ];
        return;
      case "modifieds":
        listInfo.itemChildrenBuilder = c => [
          span({ class: "modified-content-mark" })(""),
          span()(c.title)
        ];
      case "livings":
        listInfo.itemChildrenBuilder = c => [
          span({ class: "living-content-mark" })(""),
          span()(c.title)
        ];
      case "deads":
        listInfo.itemChildrenBuilder = c => [
          span({ class: "dead-content-mark" })(""),
          span()(c.title)
        ];
    }
  });
  return div()(
    ul()(
      li({ onclick: () => listKind = "news" })(span()("New")),
      li({ onclick: () => listKind = "modifieds" })(span()("Modified")),
      li({ onclick: () => listKind = "livings" })(span()("Live")),
      li({ onclick: () => listKind = "deads" })(span()("Dead"))
    ),
    new ListSelector<Content>(listInfo).element
  );
};
