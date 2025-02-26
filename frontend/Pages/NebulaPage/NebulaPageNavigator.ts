import { U } from "@/engine"
import { div, button, Attribute } from "@/funcObject"
import context from "../../context"
import { LucideIcon } from "../../Components/utils/Icon"
import { ChevronDown } from "lucide"

export function NebulaPageNavigator(){
    const containerAttr:Attribute<"div"> = {
      inlineStyle: U(() => ({
        position: "absolute",
        top: "0",
        left: context.selection.content && context.screenSplit ? "25%" : "50%",
        zIndex: "1",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        translate: "-50%"
      }))
    }
    const openerAttr:Attribute<"div"> = {
      inlineStyle: U(() => ({
        position: "absolute",
        display: context.isOpenedPageNavigator ? "none" : "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "60px",
        height: "20px",
        background: "#ccc",
        borderRadius: "0 0 10px 10px",
        border: "1px solid #bbb",
        color: "#999"
      })),
      onclick: () => context.isOpenedPageNavigator = true
    }
    const attr:Attribute<"div"> = {
      inlineStyle: U(() => ({
        position: "absolute",
        top: "0",
        display: "flex",
        borderRadius: "5px",
        width: "80px",
        height: "40px",
        background: "#ccc",
        transition: "0.2s",
        translate: context.isOpenedPageNavigator ? "0 25px" : "0 -120px",
        alignItems: "center",
        justifyContent: "center",
        border: "1px solid #bbb"
      }))
    }
    const arrowStyle:Attribute<"button">["inlineStyle"] = {
        border: "none",
        background: "none"
    }
    const leftArrowAttr:Attribute<"button"> = {
        inlineStyle: arrowStyle,
        onclick: () => {
            if (context.currentNebulaPageNumber <= 0) return;
            if (context.screenSplit) {
                if (context.currentNebulaPageNumber <= 1) return;
                context.currentNebulaPageNumber -= 2;
            }
            else context.currentNebulaPageNumber--;
        }
    }
    const rightArrowAttr:Attribute<"button"> = {
        inlineStyle: arrowStyle,
        onclick: () => {
            const dustCount = context.selection.nebula?.tree.traverse().map(i => i.node.data.dusts.traverse()).flat().length ?? 0
            console.log(context.selection.nebula?.tree.traverse())
            if (context.currentNebulaPageNumber >= Math.ceil(dustCount / 30)) return;
            if (context.screenSplit) context.currentNebulaPageNumber += 2;
            else context.currentNebulaPageNumber++;
        }
    }
  
    return (
      div(containerAttr)(
        div(openerAttr)(LucideIcon(ChevronDown)),
        button({
            inlineStyle: U(() => ({
                display: context.isOpenedPageNavigator ? "" : "none",
                border: "none",
                borderRadius: "50%",
                background: "cornflowerblue",
                top: "5px",
                position: "absolute"
            })),
            onclick: () => context.isOpenedPageNavigator = false
        })("↑"),
        div(attr)(
          button(leftArrowAttr)("<"),
          div()(() => context.currentNebulaPageNumber + 1 + ""),
          div()("/"),
          div()(() => {
            const dustCount = context.selection.nebula?.tree.traverse().map(i => i.node.data.dusts.traverse()).flat().length ?? 0
            return 1 + Math.ceil(dustCount / 30) + ''
          }),
          button(rightArrowAttr)(">")
        )
      )
    )
  }