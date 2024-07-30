import { div, li, span, ul } from "@/funcObject";
import { ListSelector } from "../../../ListSelector/ListSelector";
import { Content, Data } from "../../../data/Data";
import { engine } from "@/engine";


export const LifetimeNebulaList = (info: { data: Data; }) => {
  let listKind = "new" as "news" | "modifieds" | "livings" | "deads";

  const listInfo = {
    datas: new Array<Content>(),
    page: 1,
    capacity: 15,
    keyword: "",
    filter: (c: Content, s:string) => c.title.includes(s),
    componentBuilder: (info:{data:Content}) => div()()
  };

  return div()([
    ul()([
      li({ onclick: () => listKind = "news" })("New"),
      li({ onclick: () => listKind = "modifieds" })("Modified"),
      li({ onclick: () => listKind = "livings" })("Live"),
      li({ onclick: () => listKind = "deads" })("Dead")
    ]),
    ListSelector<Content>(listInfo)
  ]);
};
