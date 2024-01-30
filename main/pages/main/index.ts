import { HTMLObject } from "@/objects/HTMLObject";
import {UpperMenu, ContentsList} from "../../custom-object"
import {data} from "../../data/Data"
import "../style.css"
import { body, btn } from "@/funcObject";
import { no_open_target } from "../../messages";
import { receiveNewContent } from "../../respond";
import { Family } from "@/factors/Family";
import { WTest } from "@/objects/WTest";
import { WebObject } from "@/objects/WebObject";

//const list = new ContentsList(data)

//alert(WTest)
//alert(Family)
alert(WebObject)
/*
body(
  new UpperMenu(),
  list,
  btn("Open").input.onclick(() => {
    if (!list.selection?.data) return alert(no_open_target)
    data.selectedContent = list.selection.data;
    window.open("../content-page/content-page.html")
  }),
  btn("start nebula").input.onclick(() => {
    if (!list.selection?.data) return alert("컨텐트를 선택해주세요.");
    data.selectedNebula = data.addNebula(
      list.selection.data.title,
      "Story",
      list.selection.data
    )

    window.open("./nebula.html", "_self")
  }),
  btn("+").input.onclick(() => {
    receiveNewContent()
    list.update()
  }),
  btn("🗑").input.onclick(() => {
    if (!list.selection?.data) return alert("삭제할 컨텐트를 선택하세요")
    data.contents.remove(list.selection.data.id)
    list.update()
  })
)*/