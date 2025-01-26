import { div, li, span, textarea, ul } from "@/funcObject"
import context from "../../context"
import { Content } from "../../../backend/data/Data"
import { engine, Repeat, U } from "@/engine"
import { Dust } from "../../../backend/data/components/Dust"
import { Tree, TreeNode } from "@/data-structure/tree"
import { Title } from "../../Components/Title"
import { Bookmarks } from "./Bookmarks"
import { RelationDustSet } from "./RelationDustSet"
import { splitIntoPieces } from "../../utils/utils"
import { NebulaInfoArea } from "./NebulaInfoArea"

function DustBlock(index:number){
    const block:HTMLLIElement = (
        li({inlineStyle: {transition: "0.2s", position: "absolute", width: "calc(100% - 25px)"}})(
            div({
                inlineStyle: {cursor: "text", userSelect: "text", minHeight: "1rem"}, 
                onclick: () => {
                    const range = window.getSelection()?.getRangeAt(0);
                    if (!range) return;
                    const sp = range.startContainer.parentElement;
                    if (!sp) return;
                    const container = sp.parentElement;
                    if (!container) return;
                    const children = [...container.children];
                    const texts = children.slice(0, children.indexOf(sp) + 1).map(c => (<HTMLElement>c).innerText);
                    texts[texts.length - 1] = texts[texts.length - 1].slice(0, range.startOffset);
                    const text = document.querySelector("textarea");
                    if (!text) return;
                    const index = Number(container.parentElement!.dataset.index);
                    const textLines = text.value.split("\n");
                    text.focus({preventScroll: true})
                    text.selectionStart = [...textLines.slice(0, index), texts.join("")].join("\n").length + (textLines[index]?.indexOf("]") ?? 0) + 1;
                    text.selectionEnd = text.selectionStart;
                }
            })(
                Repeat(
                    (i:{kind:"text"|"ref"|"file", text:string}) => {
                        let isValidFile = true;
                        engine.updater.register(() => {
                            if (i.kind !== "file") return;
                            window.electron.exists(i.text.slice(2, i.text.length - 2)).then(b => isValidFile = b);
                        })
                        return span({
                            className: U(() => i.kind !== "text" ? "hover-eee" : ""),
                            inlineStyle: U(() => ({
                                color: {
                                    text: "",
                                    ref: "skyblue",
                                    file: "orange"
                                }[i.kind],
                                background: i.kind === "file" && !isValidFile && !i.text.endsWith("()}}") ? "red" : "",
                                cursor: i.kind === "text" ? "" : "default"
                            })),
                            innerHTML: U(t => {
                                if (t.innerText !== i.text.replaceAll(" ", " ")) {
                                    t.innerText = i.text;
                                }
                                return t.innerHTML.replaceAll(" ", "&nbsp;")
                            }),
                            onclick: async e => {
                                if (i.kind === "text") return;
                                e.stopPropagation();
                                if (i.kind === "ref") {
                                    const content = context.data.contents.find(c => `[[${c.title}]]` === i.text);
                                    if (!context.selection.nebula?.tree.traverse().find(i => i.node.data === content)){
                                        context.selection.universe = context.data.systemUniverse;
                                        context.selection.nebula = context.data.systemUniverse.dayNebula;
                                    }
                                    context.selection.content = content;
                                }
                                if (i.kind === "file"){
                                    const content = context.selection.content;
                                    if (!content) return;
                                    context.screenSplit = true;
                                    if (i.text.endsWith("()}}")){
                                        const blockIndex = Number(block.dataset.index);
                                        const dustTreeArray = content.dusts.traverse();
                                        const parentDustInfo = dustTreeArray.slice(0, blockIndex).findLast(i => i.depth + 1 === dustTreeArray[blockIndex].depth);
                                        const fileName = splitIntoPieces(parentDustInfo?.node.data.claim ?? "").find(p => p.kind === "file" && p.text.endsWith(".html}}"))?.text.slice(2, -2);
                                        const functionName = i.text.slice(2, i.text.length - 4);

                                        if (!fileName) return;
                                        if (context.openedFile !== fileName){
                                            context.iframeOnload = functionName;
                                        }
                                        context.openedFile = fileName;

                                        (frames[0] as any)?.[functionName]?.()
                                    }
                                    else if (!isValidFile){
                                        console.log(await window.electron.openDialogFile());
                                        return;
                                    }
                                    else{
                                        context.openedFile = i.text.slice(2, i.text.length - 2); 
                                    }
                                }
                            }
                        })()
                    },
                    () => splitIntoPieces(block.dataset.claim ?? "")
                )
            )
        )
    )
    block.dataset.index = index + '';
    return block;
}
function ContentBody(){
    return ul({inlineStyle: {display: "flex", flexDirection: "column", position: "relative"}})();
}
export function ContentEditor(){
    let textFocused = false;
    let contentBody:HTMLElement;
    let prevContent = context.selection.content;
    let newRefContents = new Array<string>();
    let cursorWaitingTime = 2;

    function adjustDustBlocks(count:number){
        const dustBlocks = [...contentBody.children].sort((a, b) => Number((<HTMLElement>a).dataset.index) - Number((<HTMLElement>b).dataset.index));
        for (let i = dustBlocks.length - 1; i >= count; i--){
            dustBlocks[i].remove();
        }
        for (let i = dustBlocks.length; i < count; i++){
            contentBody.append(DustBlock(i));
        }
    }

    const cursor = div({
        inlineStyle: {
            width: "1px", 
            height: "1rem", 
            background: "black", 
            position: "absolute", 
            top: "0"
        },
        className: U(() => cursorWaitingTime >= 2 ? "blink" : "")
    })();
    const textWidthMeasure = div({inlineStyle: {position: "absolute", opacity: "0", pointerEvents: "none", top: "0"}})();

    engine.updater.register(() => {
        cursorWaitingTime++;
    })

    return (
        div({ class: "page" })(
            div({ className: U(() => `content-editor ${context.selection.content ? "" : "hidden"}`.trim())})(
                Bookmarks(),
                Title({
                    get string(){
                        return context.selection.content?.title ?? ""
                    },
                    set string(v:string){
                        if (!context.selection.content) return;
                        context.selection.content.title = v;
                    }
                }),
                NebulaInfoArea(),
                contentBody = ContentBody(),
                textarea({
                    inlineStyle: {
                        height: "0",
                        position: "fixed",
                        top: "-20px",
                        right: "0",
                        width: "calc(100% - 44px)",
                        background: "aquamarine"
                    },
                    onfocus: () => textFocused = true,
                    onblur: () => {
                        cursor.remove();
                        textFocused = false
                    },
                    onselectionchange: e => {
                        const text = <HTMLTextAreaElement>e.target;
                        const before = text.value.slice(0, text.selectionStart);
                        const lineBeforeSelection = before.split("\n").at(-1);
                        const after = text.value.slice(text.selectionStart);

                        if (!before.includes("\n") && !before.includes("]")){
                            text.selectionStart = text.value.indexOf("]") + 1;
                            text.selectionEnd= text.selectionStart;
                        }
                        else if (lineBeforeSelection?.length === 0){
                            text.selectionStart += after.indexOf("]") + 1;
                            text.selectionEnd = text.selectionStart;
                        }
                        else if (lineBeforeSelection?.indexOf("]") === -1){
                            text.selectionStart -= (lineBeforeSelection.length ?? 0) + 1;
                            text.selectionEnd = text.selectionStart;
                        }
                    },
                    oninput: () => {
                        const content = context.selection.content;
                        if (!content) return;
                        if (context.data.systemNebulas.day.modify.find(i => i.content === content)) return;
                        context.data.systemNebulas.day.modify.push({
                            content: content,
                            day: new Date()
                        })
                    },
                    onkeydown: e => {
                        const text = <HTMLTextAreaElement>e.target;
                        cursorWaitingTime = 0;
                        if (e.code === "Enter"){
                            if (e.isComposing) return;
                            e.preventDefault();
                            const cursorPos = text.selectionStart;
                            const token = `\n[${context.data.dusts.add(new Dust()).id}]`;
                            text.value = text.value.slice(0, cursorPos) + token + text.value.slice(cursorPos);
                            text.selectionStart = cursorPos + token.length;
                            text.selectionEnd = cursorPos + token.length;
                        }
                        else if (e.code === "ArrowDown"){
                            if (e.isComposing) return;
                            if (e.altKey){
                                e.preventDefault();
                                const cursor = text.selectionStart;
                                const before = text.value.slice(0, text.selectionStart);
                                const after = text.value.slice(text.selectionStart);
                                const currentLine = before.slice(before.lastIndexOf("\n") + 1) + after.slice(0, after.indexOf("\n"));
                                const nextLine = after.split("\n")[1]
                                
                                if (!nextLine) return;

                                const currentLineNumber = before.split("\n").length - 1;
                                const dustBlocks = [...contentBody.children].sort((a, b) => Number((<HTMLElement>a).dataset.index) - Number((<HTMLElement>b).dataset.index));

                                (<HTMLElement>dustBlocks[currentLineNumber + 1]).dataset.index = currentLineNumber + "";
                                (<HTMLElement>dustBlocks[currentLineNumber]).dataset.index = currentLineNumber + 1 + "";
                                
                                const restBeforeArr = before.split("\n");
                                const restBefore = restBeforeArr.slice(0, restBeforeArr.length - 1).join("\n");
                                const restAfter = after.split("\n").slice(2).join("\n");

                                text.value = (restBefore + "\n" + nextLine).trimStart() + "\n" + currentLine + ("\n" + restAfter).trimEnd();
                                text.selectionStart = cursor + nextLine.length + 1;
                                text.selectionEnd = text.selectionStart;
                            }
                        }
                        else if (e.code === "ArrowUp"){
                            if (e.isComposing) return;
                            if (e.altKey){
                                e.preventDefault();
                                const cursor = text.selectionStart;
                                const before = text.value.slice(0, text.selectionStart);
                                const after = text.value.slice(text.selectionStart);
                                const currentLine = before.slice(before.lastIndexOf("\n") + 1) + after.slice(0, after.indexOf("\n"));
                                const prevLine = before.split("\n").at(-2);
                                
                                if (!prevLine) return;

                                const currentLineNumber = before.split("\n").length - 1;
                                const dustBlocks = [...contentBody.children].sort((a, b) => Number((<HTMLElement>a).dataset.index) - Number((<HTMLElement>b).dataset.index));

                                (<HTMLElement>dustBlocks[currentLineNumber - 1]).dataset.index = currentLineNumber + "";
                                (<HTMLElement>dustBlocks[currentLineNumber]).dataset.index = currentLineNumber - 1 + "";
                                
                                const restBeforeArr = before.split("\n");
                                const restBefore = restBeforeArr.slice(0, restBeforeArr.length - 2).join("\n");
                                const restAfter = after.split("\n").slice(1).join("\n");

                                text.value = (restBefore + "\n" + currentLine).trimStart() + "\n" + prevLine + ("\n" + restAfter).trimEnd();
                                text.selectionStart = cursor - prevLine.length - 1;
                                text.selectionEnd = text.selectionStart;
                            }
                        }
                        else if (e.code === "Tab"){
                            if (e.isComposing) return;
                            e.preventDefault();
                            const cursor = text.selectionStart;
                            const before = text.value.slice(0, text.selectionStart);
                            const after = text.value.slice(text.selectionStart);
                            const restBeforeArr = before.split("\n");
                            const restBefore = restBeforeArr.slice(0, restBeforeArr.length - 1).join("\n");
                            const restAfter = after.split("\n").slice(1).join("\n");
                            const line = before.slice(before.lastIndexOf("\n") + 1) + after.slice(0, after.indexOf("\n"));

                            if (e.shiftKey){
                                const newLine = line.slice(0, line.indexOf("]") + 1) + line.slice(line.indexOf("]") + 2)

                                text.value = (restBefore + "\n" + newLine).trimStart() + ("\n" + restAfter).trimEnd()
                                text.selectionStart = cursor - 1;
                                text.selectionEnd = text.selectionStart;                                
                            }
                            else{
                                const newLine = line.slice(0, line.indexOf("]") + 1) + "\t" + line.slice(line.indexOf("]") + 1)

                                text.value = (restBefore + "\n" + newLine).trimStart() + ("\n" + restAfter).trimEnd()
                                text.selectionStart = cursor + 1;
                                text.selectionEnd = text.selectionStart;
                            }
                        }
                        else if (e.code === "Backspace"){
                            const cursor = text.selectionStart;
                            const before = text.value.slice(0, text.selectionStart);
                            const after = text.value.slice(text.selectionStart);
                            const line = before.split("\n").at(-1);
                            if (!line) return;
                            if (line.slice(line.indexOf("]") + 1, line.length).split("").some(c => c !== "\t")) return;
                            text.value = before.slice(0, before.length - line.length) + after;
                            text.selectionStart = cursor - line.length;
                            text.selectionEnd = text.selectionStart;
                        }

                    },
                    value: U(text => {
                        if (prevContent !== context.selection.content){
                            prevContent = context.selection.content;

                            if (prevContent){
                                newRefContents = prevContent.dusts.traverse().map(i => splitIntoPieces(i.node.data.claim).filter(p => p.kind === "ref").map(p => p.text.slice(2, p.text.length - 2))).flat()
                                text.value = prevContent.dusts.traverse()
                                    .map(i => `[${i.node.data.id}]${"\t".repeat(i.depth)}${i.node.data.claim}`)
                                    .join("\n")
                            }
                        }
                        const content = context.selection.content;
                        if (!content) return text.value;
                        if (!textFocused){
                            text.value = content.dusts.traverse()
                                .map(i => `[${i.node.data.id}]${"\t".repeat(i.depth)}${i.node.data.claim}`)
                                .join("\n")
                        }

                        const lineInfos = text.value.split("\n").map(l => {
                            const chars = l.slice(l.indexOf("]") + 1).split("");
                            const firstNotTabIndex = chars.findIndex(c => c !== "\t");
                            return {
                                id: Number(l.slice(1, l.indexOf("]"))),
                                depth: firstNotTabIndex < 0 ? chars.length : firstNotTabIndex,
                                claim: l.slice(l.indexOf("]") + 1).trimStart()
                            }
                        });

                        // element update

                        adjustDustBlocks(lineInfos.length);
                        const dustBlocks = [...contentBody.children].sort((a, b) => Number((<HTMLElement>a).dataset.index) - Number((<HTMLElement>b).dataset.index));
                        let currentHeight = 0;

                        for (let i = 0; i < dustBlocks.length; i++){
                            const block = <HTMLElement>dustBlocks[i];
                            
                            block.dataset.claim = lineInfos[i].claim;
                            block.style.top = `${currentHeight}px`                            
                            block.style.marginLeft = `${lineInfos[i].depth * 2}rem`
                            currentHeight += Math.floor(block.scrollHeight);
                        }
                        contentBody.style.height = currentHeight + "px"

                        // determine cursor position

                        if (textFocused){
                            const selectionBeforeLines = text.value.slice(0, text.selectionStart).split("\n");
                            const selectionLine = selectionBeforeLines[selectionBeforeLines.length - 1];
                            const cursorPosition = {
                                line: selectionBeforeLines.length - 1,
                                index: selectionLine.length - 1
                            }
                            const measureTarget = selectionLine.slice(selectionLine.indexOf("]") + 1);
                            if (measureTarget !== textWidthMeasure.innerText.replaceAll(" ", " ")){
                                textWidthMeasure.innerText = selectionLine.slice(selectionLine.indexOf("]") + 1);
                                textWidthMeasure.innerHTML = textWidthMeasure.innerHTML.replaceAll(" ", "&nbsp;");
                            }
                            if (!dustBlocks[cursorPosition.line].contains(cursor)){
                                dustBlocks[cursorPosition.line].append(cursor, textWidthMeasure)
                            }
                            cursor.style.left = textWidthMeasure.scrollWidth + "px";
                        }
                        else {
                            cursor.remove();
                            textWidthMeasure.remove();
                        }
                        
                        // data update
                        content.dusts = new Tree()
                        const queue = [content.dusts.root];

                        for (let i = 0; i < lineInfos.length; i++){
                            const lineInfo = lineInfos[i];
                            const nextLineInfo = lineInfos[i + 1];

                            const node = content.dusts.insert(new TreeNode(context.data.dusts.get(lineInfo.id) ?? context.data.dusts.add(new Dust({id: lineInfo.id}))), queue[queue.length - 1])
                            node.data.claim = lineInfo.claim;

                            if (!nextLineInfo) break;
                            if (lineInfo.depth < nextLineInfo.depth) {
                                queue.push(node)
                            }
                            else {
                                for (let j = 0; j < lineInfo.depth - nextLineInfo.depth; j++){
                                    queue.pop()
                                }
                            }
                        }

                        // record
                        if (context.isRecordingContent){
                            const nebula = context.selection.nebula;
                            if (!nebula) return text.value;
                            const node = nebula.tree.nodes.find(n => n.data === content)
                            if (!node) return text.value;

                            const currentRefs = content.dusts.traverse().map(i => splitIntoPieces(i.node.data.claim).filter(p => p.kind === "ref").map(p => p.text.slice(2, p.text.length - 2))).flat()
                            const insertedRefs = currentRefs.filter(r => !newRefContents.includes(r));

                            for (const contentTitle of insertedRefs){
                                const insertedContent = context.data.contents.find(c => c.title === contentTitle) ?? context.data.addContent(new Content({title: contentTitle}));
                                if (node.children.some(c => c.data === insertedContent)) return text.value;
                                nebula.tree.insert(new TreeNode(insertedContent), node);
                            }
                            newRefContents = currentRefs;
                        }

                        return text.value;
                    })
                })(),
                RelationDustSet()
            )
        )
    )
}