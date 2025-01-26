import { Repeat, U } from "@/engine";
import { div } from "@/funcObject";
import context from "../context";

export function RelationPage(){
    return (
      div({class: "relation-page"})(
        div({class: "title"})(() => {
          if (!context.selection.relation) return "";
          return `${context.selection.relation.mainTree.name} - ${context.selection.relation.secondTree.name}`
        }),
        div({ class: "relation-table" })(
          div()(),
          div({inlineStyle: {display: "flex"}})(Repeat(
            i => div({
              className: U(() => context.selection.content === i.node.data ? "selected" : ""),
              inlineStyle: {cursor: "s-resize", width: "20px", writingMode: "vertical-lr", textOrientation: "sideways", scale: "-1"},
              onclick: () => context.selection.content = i.node.data})(() => i.node.data.title),
            () => {
              if (!context.selection.relation) return [];
              return context.selection.relation.mainTree.tree.leafs.map(n => ({node: n}))
            }
          )),
          div({inlineStyle: {display: "flex", flexDirection: "column"}})(Repeat(
            i => div({
              className: U(() => context.selection.content === i.node.data ? "selected" : ""),
              inlineStyle: {cursor: "e-resize", height: "20px"}, onclick: () => context.selection.content = i.node.data})(() => i.node.data.title),
            () => {
              if (!context.selection.relation) return [];
              return context.selection.relation.secondTree.tree.leafs.map(n => ({node: n}))
            }
          )),
          div()(Repeat(
            i => div({inlineStyle: {display: "flex"}})(
              Repeat(
                i => div({inlineStyle: U(() => {
                  return {
                    width: i.main === context.selection.content ? "18px" : "20px",
                    height: i.second === context.selection.content ? "18px" : "20px",
                    background: i.dust ? "blue" : "white",
                    borderLeft: context.selection.content && (i.main === context.selection.content) ? "1px solid" : "",
                    borderRight: context.selection.content && (i.main === context.selection.content) ? "1px solid" : "",
                    borderTop: context.selection.content && (i.second === context.selection.content) ? "1px solid" : "",
                    borderBottom: context.selection.content && (i.second === context.selection.content) ? "1px solid" : "",
                  }
                }
                )})(),
                () => {
                  if (!context.selection.relation) return [];
                  const main = context.selection.relation.mainTree.tree.leafs;
                  return (
                    main.map(m => ({
                      main: m.data,
                      second: i.node.data,
                      dust: context.selection.relation!.table.find(cell => cell.main === m.data && cell.second === i.node.data)
                    }))
                  );
                }
              )
            ),
            () => {
              if (!context.selection.relation) return [];
              return context.selection.relation.secondTree.tree.leafs.map(tn => ({node: tn}))
            }
          ))
        )
      )
    )
  }