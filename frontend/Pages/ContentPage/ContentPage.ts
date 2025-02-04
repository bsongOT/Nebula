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
import { FileAliasPage } from "./FileAliasPage"

function DustBlock(index:number){
    const block:HTMLLIElement = (
        li({
            inlineStyle: {cursor: "text", userSelect: "text", transition: "all 0.2s, background-color 0s", position: "absolute", width: "-webkit-fill-available"},
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
                text.selectionStart = [...textLines.slice(0, index), texts.join("")].join("\n").length + (textLines[index]?.indexOf("]") ?? 0) + Number(container.parentElement!.dataset.depth) + 1;
                text.selectionEnd = text.selectionStart;
            }
        })(
            div({inlineStyle: {cursor: "text", userSelect: "text", minHeight: "1rem", display: "inline-block"}})(
                Repeat(
                    (i:{kind:"text"|"ref"|"file", text:string}) => {
                        let isValidFile = true;
                        engine.updater.register(() => {
                            if (i.kind !== "file") return;
                            const fileName = i.text.slice(2, -2);
                            if (context.data.fileAliases[fileName] === undefined) window.electron.exists(fileName).then(b => isValidFile = b);
                            else window.electron.exists(context.data.fileAliases[fileName]).then(b => isValidFile = b);
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
                                    const content = context.data.contents.find(c => `[[${c.title}]]` === i.text) ?? context.data.addContent(new Content({title: i.text.slice(2, -2)}));
                                    if (e.ctrlKey || e.metaKey){
                                        context.secondSelection = {
                                            universe: context.data.systemUniverse,
                                            nebula: context.data.systemUniverse.dayNebula,
                                            content: content
                                        }
                                        context.tabs.push(context.secondSelection);
                                        context.screenSplit = true;
                                        return;
                                    }
                                    if (!context.selection.nebula?.tree.traverse().find(i => i.node.data === content)){
                                        context.selection.universe = context.data.systemUniverse;
                                        context.selection.nebula = context.data.systemUniverse.dayNebula;
                                    }
                                    context.selection.content = content;
                                }
                                if (i.kind === "file"){
                                    if (e.ctrlKey || e.metaKey) {
                                        document.body.append(FileAliasPage())
                                        return;
                                    }
                                    const content = context.selection.content;
                                    if (!content) return;
                                    if (i.text.endsWith("()}}")){
                                        const blockIndex = Number(block.dataset.index);
                                        const dustTreeArray = content.dusts.traverse();
                                        const parentDustInfo = dustTreeArray.slice(0, blockIndex).findLast(i => i.depth + 1 === dustTreeArray[blockIndex].depth);
                                        const fileName = splitIntoPieces(parentDustInfo?.node.data.claim ?? "").find(p => p.kind === "file" && (p.text.endsWith(".html}}") || context.data.fileAliases[p.text.slice(2, -2)]?.endsWith(".html")))?.text.slice(2, -2) ?? "";
                                        const originalFileName = context.data.fileAliases[fileName] ?? fileName;
                                        const functionName = i.text.slice(2, i.text.length - 4);

                                        if (!originalFileName || originalFileName === "") return;
                                        if (context.openedFile !== originalFileName){
                                            context.iframeOnload = functionName;
                                        }
                                        context.openedFile = originalFileName;

                                        (frames[0] as any)?.[functionName]?.()
                                    }
                                    else if (!isValidFile){
                                        context.data.fileAliases[i.text.slice(2, -2)] = ""                                        
                                        document.body.append(FileAliasPage())
                                    }
                                    else{
                                        context.screenSplit = true;
                                        const fileName = i.text.slice(2, -2);
                                        context.openedFile = context.data.fileAliases[fileName] ?? fileName; 
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
            (<HTMLElement>dustBlocks[i]).dataset.isDisposable = "";
            [...dustBlocks[i].querySelectorAll<HTMLElement>("*")].forEach(de => de.dataset.isDisposable = "");
            dustBlocks[i].remove();
        }
        for (let i = dustBlocks.length; i < count; i++){
            contentBody.append(DustBlock(i));
        }
    }
    function getLineDepth(line:string){
        const lineWithoutId = line.slice(line.indexOf("]") + 1);
        return (
            lineWithoutId.length - lineWithoutId.trimStart().length
        )
    }
    function handleIndent(text:HTMLTextAreaElement, e:KeyboardEvent){
        if (e.isComposing) return;
        e.preventDefault();
        const cursor = text.selectionStart;
        const cursorEnd = text.selectionEnd;
        const startLine = text.value.slice(0, text.selectionStart).split("\n").length - 1;
        const endLine = text.value.slice(0, text.selectionEnd).split("\n").length - 1;
        const lines = text.value.split("\n");
        const currentDepth = getLineDepth(lines[startLine]);

        if (e.shiftKey){
            const afterDepth = getLineDepth(lines[startLine + 1] ?? "");

            if (currentDepth === 0) return;
            if (lines[startLine + 1] && afterDepth - 1 >= currentDepth) return;

            for (let i = startLine; i <= endLine; i++){
                lines[i] = lines[i].replace("]\t", "]");
            }
            text.value = lines.join("\n");
            text.selectionStart = cursor - 1;
            text.selectionEnd = cursorEnd - 1 - endLine + startLine;                          
        }
        else{
            const prevDepth = getLineDepth(lines[startLine - 1] ?? "");

            if (!lines[startLine - 1] || prevDepth + 1 <= currentDepth) return;

            for (let i = startLine; i <= endLine; i++){
                lines[i] = lines[i].replace("]", "]\t");
            }
            text.value = lines.join("\n");
            text.selectionStart = cursor + 1;
            text.selectionEnd = cursorEnd + 1 + endLine - startLine;
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
    const cursorStartHighlightBegin = span({inlineStyle: {color: "#00000000"}})();
    const cursorStartHighlightEnd = span({inlineStyle: {color: "#00000000", background: "lightblue"}})();
    const cursorStartHighlight = (
        div({inlineStyle: {position: "absolute", top: "0", left: "0", zIndex: "-1"}})(
            cursorStartHighlightBegin,
            cursorStartHighlightEnd
        )
    )
    const cursorEndHighlightBegin = span({inlineStyle: {color: "#00000000", background: "lightblue"}})();
    const cursorEndHighlightEnd = span({inlineStyle: {color: "#00000000"}})();
    const cursorEndHighlight = (
        div({inlineStyle: {position: "absolute", top: "0", left: "0", zIndex: "-1"}})(
            cursorEndHighlightBegin,
            cursorEndHighlightEnd
        )
    );
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
                    class: "content-text",
                    inlineStyle: {
                        height: "0",
                        position: "fixed",
                        top: "0",
                        right: "0",
                        width: "calc(100% - 44px)",
                        background: "none",
                        color: "#00000000",
                        pointerEvents: "none"
                    },
                    onfocus: () => textFocused = true,
                    onblur: () => {
                        cursor.remove();
                        textFocused = false
                    },
                    onselectionchange: function() {
                        const text = <HTMLTextAreaElement>this;
                        const before = text.value.slice(0, text.selectionStart);
                        const lineBeforeSelection = before.split("\n").at(-1);
                        const after = text.value.slice(text.selectionStart);

                        if (text.value.split("\n").some(l => !l.startsWith("["))){
                            return;
                        }
                        if (!before.includes("\n") && !before.includes("]")){
                            text.selectionStart = text.value.indexOf("]") + 1;
                        }
                        else if (lineBeforeSelection?.length === 0){
                            text.selectionStart += after.indexOf("]") + after.slice(after.indexOf("]") + 1).split("").findIndex(c => c !== "\t") + 1;
                        }
                        else if (lineBeforeSelection?.indexOf("]") === -1 || after.startsWith("\t")){
                            if (text.selectionStart === text.selectionEnd){
                                text.selectionStart -= (lineBeforeSelection?.length ?? 0) + 1;
                                text.selectionEnd = text.selectionStart;
                            }
                            else {
                                text.selectionStart -= (lineBeforeSelection?.length ?? 0) + 1;
                            }
                        }
                    },
                    oninput: function(e) {
                        const text = <HTMLTextAreaElement>this;

                        if ((<InputEvent>e).inputType === "insertLineBreak"){
                            const cursorPos = text.selectionStart;
                            const lines = text.value.split("\n");
                            const beforeLines = text.value.slice(0, cursorPos).split("\n");
                            const lineNumber = beforeLines.length - 1;
                            const prevDepth = getLineDepth(lines[lineNumber - 1] ?? "");
                            lines[lineNumber] = "\t".repeat(prevDepth) + lines[lineNumber];
                            text.value = lines.join("\n");
                            text.selectionStart = cursorPos + prevDepth;
                            text.selectionEnd = text.selectionStart;
                        }

                        const content = context.selection.content;
                        if (!content) return;
                        context.data.registerModifiedContent(content);
                    },
                    onpaste: function(e){
                        const pastedStr = e.clipboardData?.getData("text/plain");
                        if (!pastedStr) return;
                        const text = this as HTMLTextAreaElement;
                        const cursorPos = text.selectionStart;
                        const beforeLines = text.value.slice(0, cursorPos).split("\n");
                        const lineNumber = beforeLines.length - 1;
                        const pastedStrLineCount = pastedStr.split("\n").length;

                        for (const block of contentBody.children){
                            const index = Number((block as HTMLElement).dataset.index);
                            if (index <= lineNumber) continue;

                            (block as HTMLElement).dataset.index = index + pastedStrLineCount - 1 + "";
                        }
                        for (let i = 1; i < pastedStrLineCount; i++){
                            const block = DustBlock(lineNumber + i);
                            contentBody.append(block);
                        }
                    },
                    onkeydown: function(e) {
                        const text = <HTMLTextAreaElement>this;
                        cursorWaitingTime = 0;

                        if (e.code === "KeyC"){
                            if ((e.ctrlKey || e.metaKey) && e.shiftKey){
                                e.preventDefault();
                                navigator.clipboard.writeText(
                                    text.value
                                        .slice(text.selectionStart, text.selectionEnd)
                                        .split("\n")
                                        .map((l, i) => i === 0 ? l : l.slice(l.indexOf("]") + 1))
                                        .join("\n")
                                )
                            }
                        }
                        else if (e.code === "Enter"){
                            if (e.isComposing) return;
                            const cursorPos = text.selectionStart;
                            const lines = text.value.split("\n");
                            const beforeLines = text.value.slice(0, cursorPos).split("\n");
                            const lineNumber = beforeLines.length;
                            for (const block of contentBody.children){
                                const index = Number((block as HTMLElement).dataset.index);
                                if (index < lineNumber) continue;

                                (block as HTMLElement).dataset.index = index + 1 + "";
                            }
                            const block = DustBlock(lineNumber);
                            block.style.marginLeft = `${2 * getLineDepth(lines[lineNumber - 1])}em`;
                            contentBody.append(block);
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
                            handleIndent(text, e)
                        }
                        else if (e.code === "Backspace"){
                            const cursor = text.selectionStart;
                            const before = text.value.slice(0, text.selectionStart);
                            const after = text.value.slice(text.selectionStart);
                            const beforeLines = before.split("\n");
                            const line = beforeLines.at(-1);
                            const lineNumber = beforeLines.length - 1;

                            if (text.selectionStart === text.selectionEnd) {
                                const cursorNeighbor = (text.value[cursor - 1] ?? "") + text.value[cursor];
                                if (cursorNeighbor === "()" || cursorNeighbor === "[]" || cursorNeighbor === "{}"){
                                    e.preventDefault();
                                    text.value = text.value.slice(0, cursor - 1) + text.value.slice(cursor + 1);
                                    text.selectionStart = cursor - 1;
                                    text.selectionEnd = cursor - 1;
                                    return;
                                }
                            }
                            if (!line) return;
                            if (line.slice(line.indexOf("]") + 1, line.length).split("").some(c => c !== "\t")) return;

                            [...contentBody.children].find(el => (<HTMLElement>el).dataset.index === lineNumber + "")?.remove();
                            for (const block of contentBody.children){
                                const index = Number((block as HTMLElement).dataset.index);
                                if (index < lineNumber) continue;

                                (block as HTMLElement).dataset.index = index - 1 + "";
                            }

                            text.value = before.slice(0, before.length - line.length) + after;
                            text.selectionStart = cursor - line.length;
                            text.selectionEnd = text.selectionStart;
                        }
                        else if (e.code === "BracketLeft" || (e.code === "Digit9" && e.shiftKey)){
                            const cursor = text.selectionStart;
                            const cursorEnd = text.selectionEnd;
                            if (text.value.slice(cursor, cursorEnd).includes("\n")) return;
                            e.preventDefault();
                            const bracket = (() => {
                                if (e.code === "BracketLeft"){
                                    if (e.shiftKey) return { open: "{", close: "}" }
                                    else return { open: "[", close: "]" }
                                }
                                return { open: "(", close: ")"}
                            })()
                            text.value = text.value.slice(0, cursor) + bracket.open + text.value.slice(cursor, cursorEnd) + bracket.close + text.value.slice(cursorEnd)
                            text.selectionStart = cursor + 1;
                            text.selectionEnd = cursorEnd + 1;
                        }
                    },
                    value: U(text => {
                        text.style.translate = `0 ${232 - contentBody.getBoundingClientRect().top}px`;
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

                        const tempLines = text.value.split("\n");
                        let cursorAppend = 0;
                        for (let i = 0; i < tempLines.length; i++){
                            const l = tempLines[i];
                            const idToken = l.slice(0, l.indexOf("]") + 1);
                            if (idToken[0] !== "[" || idToken[idToken.length - 1] !== "]" || isNaN(Number(idToken.slice(1, -1)))){
                                const newIdToken = `[${context.data.dusts.add(new Dust()).id}]`;
                                tempLines[i] = `${newIdToken}${l}`;
                                cursorAppend += newIdToken.length;
                            }
                        }
                        const newValue = tempLines.join("\n");
                        if (text.value !== newValue) {
                            const cursor = text.selectionStart;
                            const cursorEnd = text.selectionEnd;
                            text.value = newValue;
                            text.selectionStart = cursor + cursorAppend;
                            text.selectionEnd = cursorEnd + cursorAppend;
                        }
                        const textLines = text.value.split("\n");
                        const lineInfos = textLines.map(l => {
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
                            
                            block.dataset.index = i + "";
                            block.dataset.claim = lineInfos[i].claim;
                            block.dataset.depth = lineInfos[i].depth + "";
                            block.style.top = `${currentHeight}px`                            
                            block.style.marginLeft = `${lineInfos[i].depth * 2}rem`;
                            (<HTMLElement>block.children[0]).style.backgroundColor = "";
                            currentHeight += Math.floor(block.scrollHeight);
                        }
                        contentBody.style.height = currentHeight + "px"

                        // determine cursor position

                        if (textFocused){
                            const selectionBeforeLines = text.value.slice(0, text.selectionStart).split("\n");
                            const selectionEndBeforeLines = text.value.slice(0, text.selectionEnd).split("\n");
                            const selectionLine = selectionBeforeLines[selectionBeforeLines.length - 1];
                            const selectionEndLine = selectionEndBeforeLines[selectionEndBeforeLines.length - 1];
                            const cursorPosition = {
                                line: selectionBeforeLines.length - 1,
                                index: selectionLine.length - 1
                            }
                            const cursorEndPosition = {
                                line: selectionEndBeforeLines.length - 1,
                                index: selectionEndLine.length - 1
                            }

                            const measureTarget = selectionLine.slice(selectionLine.indexOf("]") + 1);
                            if (measureTarget !== textWidthMeasure.innerText.replaceAll(" ", " ")){
                                textWidthMeasure.innerText = selectionLine.slice(selectionLine.indexOf("]") + 1);
                                textWidthMeasure.innerHTML = textWidthMeasure.innerHTML.replaceAll(" ", "&nbsp;");
                            }
                            if (!dustBlocks[cursorPosition.line].contains(cursor)){
                                dustBlocks[cursorPosition.line].append(cursor, textWidthMeasure)
                            }
                            const tempCursor = span()();
                            textWidthMeasure.append(tempCursor);
                            textWidthMeasure.append(document.createTextNode(text.value.slice(text.selectionStart).split("\n")[0].replaceAll(" ", "\u00A0")))
                            const cursorRect = tempCursor.getBoundingClientRect();
                            const dustBlockRect = dustBlocks[cursorPosition.line].getBoundingClientRect();
                            cursor.style.left = (cursorRect.left - dustBlockRect.left) + "px";
                            cursor.style.top = (cursorRect.top - dustBlockRect.top) + "px";
                            tempCursor.remove();

                            /**
                             * TODO: SelectionDirection에 따라 커서 위치 바꿀 것!
                             */

                            //cursor start !== cursor end
                            if (cursorPosition.line !== cursorEndPosition.line || cursorPosition.index !== cursorEndPosition.index){
                                if (cursorPosition.line === cursorEndPosition.line){
                                    dustBlocks[cursorPosition.line].append(cursorStartHighlight);
                                    cursorStartHighlightBegin.innerText = textLines[cursorPosition.line].slice(0, cursorPosition.index + 1).slice(textLines[cursorPosition.line].indexOf("]") + 1).trimStart().replaceAll(" ", "\u00A0");
                                    cursorStartHighlightEnd.innerText = textLines[cursorPosition.line].slice(cursorPosition.index + 1, cursorEndPosition.index + 1).replaceAll(" ", "\u00A0")
                                }
                                else {
                                    dustBlocks[cursorPosition.line].append(cursorStartHighlight);
                                    dustBlocks[cursorEndPosition.line].append(cursorEndHighlight);
                                    cursorStartHighlightBegin.innerText = textLines[cursorPosition.line].slice(0, cursorPosition.index + 1).slice(textLines[cursorPosition.line].indexOf("]") + 1).trimStart().replaceAll(" ", "\u00A0");
                                    cursorStartHighlightEnd.innerText = textLines[cursorPosition.line].slice(cursorPosition.index + 1).replaceAll(" ", "\u00A0")
                                    cursorEndHighlightBegin.innerText = textLines[cursorEndPosition.line].slice(0, cursorEndPosition.index + 1).slice(textLines[cursorEndPosition.line].indexOf("]") + 1).trimStart().replaceAll(" ", "\u00A0");
                                    cursorEndHighlightEnd.innerText = textLines[cursorEndPosition.line].slice(cursorEndPosition.index + 1).replaceAll(" ", "\u00A0")
                                    for (let i = cursorPosition.line + 1; i < cursorEndPosition.line; i++){
                                       (<HTMLElement>(<HTMLElement>dustBlocks[i]).children[0]).style.backgroundColor = "lightblue";
                                    }
                                }
                            }
                            else {
                                cursorStartHighlight.remove();
                                cursorEndHighlight.remove();
                            }
                        }
                        else {
                            cursor.remove();
                            textWidthMeasure.remove();
                            cursorStartHighlight.remove();
                            cursorEndHighlight.remove();
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
                            const node = nebula.tree.traverse().find(i => i.node.data === content)?.node;
                            if (!node) return text.value;
                            const currentLineFirstHalf = text.value.slice(0, text.selectionStart).split("\n").at(-1)!;
                            const currentLineLateHalf = text.value.slice(text.selectionStart).split("\n")[0];
                            const firstHalfRefCount = splitIntoPieces(currentLineFirstHalf).filter(p => p.kind === "ref").length;
                            const lateHalfRefCount = splitIntoPieces(currentLineLateHalf).filter(p => p.kind === "ref").length;
                            const lineRefCount = splitIntoPieces(currentLineFirstHalf + currentLineLateHalf).filter(p => p.kind === "ref").length;

                            if (firstHalfRefCount + lateHalfRefCount !== lineRefCount) return text.value;

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