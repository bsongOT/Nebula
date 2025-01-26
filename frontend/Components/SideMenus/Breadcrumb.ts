import { U } from "@/engine";
import { Attribute, div, span } from "@/funcObject";
import context from "../../context";

export function Breadcrumb(){
    const homeAttr:Attribute<"span"> = { 
      class: "home material-symbols-outlined hover-sandybrown", 
      onclick: () => {
        context.selection.content = undefined;
        context.selection.nebula = undefined;
        context.selection.universe = undefined;
      }
    }
    const arrow1Attr:Attribute<"div"> = {
      inlineStyle: U(() => ({
        display: context.selection.universe ? "" : "none",
        margin: "0 0.2rem"
      }))
    }
    const univAttr:Attribute<"div"> = {
      onclick: () => {
        context.selection.content = undefined;
        context.selection.nebula = undefined;
      },
      className: "hover-sandybrown",
      inlineStyle: U(() => ({
        display: context.selection.universe ? "" : "none",
        padding: "2px",
        borderRadius: "5px"
      }))
    }
    const arrow2Attr:Attribute<"div"> = {
      inlineStyle: U(() => ({
        display: context.selection.nebula ? "" : "none", 
        margin: "0 0.2rem"
      }))
    }
    const nebAttr:Attribute<"div"> = {
      className: "hover-sandybrown",
      onclick: () => context.selection.content = undefined,
      inlineStyle: U(() => ({
        display: context.selection.nebula ? "" : "none", 
        margin: "0 0.2rem", 
        padding: "2px", 
        borderRadius: "5px"
      }))
    }
    const arrow3Attr:Attribute<"div"> = {
      inlineStyle: U(() => ({
        display: context.selection.content ? "" : "none", 
        margin: "0 0.2rem"
      }))
    }
    const contentAttr:Attribute<"div"> = {
      className: "hover-sandybrown", 
      inlineStyle: U(() => ({
        display: context.selection.content ? "" : "none", 
        padding: "2px",
        borderRadius: "5px", 
        overflowX: "hidden", 
        textOverflow: "ellipsis", 
        textWrap: "nowrap"
      } as any))
    }
    return (
      div({ class: "breadcrumb", inlineStyle: {height: "23px"} })(
        span(homeAttr)("home"),
        div(arrow1Attr)(">"),
        div(univAttr)(() => context.selection.universe?.name ?? ""),
        div(arrow2Attr)(">"),
        div(nebAttr)(() => context.selection.nebula?.name ?? ""),
        div(arrow3Attr)(">"),
        div(contentAttr)(() => context.selection.content?.title ?? ""),
      )
    )
  }