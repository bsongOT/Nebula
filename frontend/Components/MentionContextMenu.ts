import { div } from "@/funcObject";
import context from "../context";
import { splitIntoPieces } from "../utils/utils";

export const mentionContextMenu = (
    div({ className: "context-menu" })(
        div({
            className: "context-menu-item",
            onclick: () => {
                const content = context.selection.content?.data;
                const mentionedContent = context.data.contents.find(c => c.title === mentionContextMenu.dataset.contentTitle);
                if (!content) return;
                if (!mentionedContent) return;
                const contents = context.data.contents.all().sort((a, b) => a.title.length - b.title.length);
                for (const dust of content.dusts.traverse().map(i => i.node.data)){
                    const pieces = splitIntoPieces(dust.claim);
                    dust.claim = pieces.map(p => {
                        if (p.kind === "text") return p.text.replaceAll(mentionedContent.title, `[[${mentionedContent.title}]]`);
                        else return p.text
                    }).join("")
                }
                mentionContextMenu.remove()
            }
        })("언급 연결하기"),
        div({
            className: "context-menu-item",
            onclick: () => {
                const content = context.selection.content?.data;
                if (!content) return;
                const contents = context.data.contents.all().sort((a, b) => a.title.length - b.title.length);
                for (const dust of content.dusts.traverse().map(i => i.node.data)){
                    for (const c of contents){
                        const pieces = splitIntoPieces(dust.claim);
                        dust.claim = pieces.map(p => {
                            if (p.kind === "text") return p.text.replaceAll(c.title, `[[${c.title}]]`);
                            else return p.text
                        }).join("")
                    }
                }
                mentionContextMenu.remove();
            }
        })("누락된 모든 언급 연결하기")
    )
)