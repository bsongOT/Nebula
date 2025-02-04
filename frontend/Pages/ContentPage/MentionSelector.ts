import { Attribute, button, div, inputText, li, ul } from "@/funcObject";
import { Content } from "../../../backend/data/Data";
import { Repeat, U } from "@/engine";
import context from "../../context";
import { splitIntoPieces } from "../../utils/utils";

export function MentionSelector(resolve:(v:Content[])=>void){
    const attr:Attribute<"div"> = {
        inlineStyle: {
            position: "fixed",
            zIndex: "1",
            width: "100%",
            height: "100%",
            backdropFilter: "blur(10px) brightness(80%)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            marginLeft: "-10px"
        }
    }
    const winAttr:Attribute<"div"> = {
        inlineStyle: {
            background: 'white',
            width: '80%',
            height: '80%',
            borderRadius: '10px',
            boxShadow: '2px 2px 4px #aaa',
            padding: '15px'
        }
    }
    let selectedContents = new Array<Content>();
    const selector = (
        div(attr)(
            div(winAttr)(
                ul()(
                    Repeat(
                        i => (
                            li({inlineStyle: {display: "flex"}})(
                                inputText({
                                    type: "checkbox",
                                    checked: U(() => selectedContents.includes(i.content)),
                                    onclick: () => {
                                        if (selectedContents.includes(i.content)) selectedContents.splice(selectedContents.indexOf(i.content), 1)
                                        else selectedContents.push(i.content)
                                    }
                                })(),
                                div()(() => i.content.title)
                            )
                        ),
                        () => {
                            if (!context.selection.content) return [];
                            const claimsOfSelectedContent = context.selection.content?.dusts.traverse().map(ii => splitIntoPieces(ii.node.data.claim).filter(p => p.kind === "text").map(p => p.text)).flat();
                            return context.data.contents.filter(c => claimsOfSelectedContent.some(cl => cl.includes(c.title))).map(c => ({content: c}))
                        }
                    )
                ),
                button({
                    onclick: () => {
                        resolve(selectedContents);
                        selector.remove()
                    }
                })("OK")
            )
        )
    )
    return selector
}