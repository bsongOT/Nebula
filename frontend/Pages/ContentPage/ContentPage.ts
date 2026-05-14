import { Attribute, audio, button, div, iframe, img, li, span, textarea, ul, video } from "@/funcObject"
import context from "../../context"
import { Content } from "../../../backend/data/Data"
import { engine, Repeat, U } from "@/engine"
import { Dust } from "../../../backend/data/components/Dust"
import { Tree, TreeNode } from "@/data-structure/tree"
import { Title } from "../../Components/Title"
import { RelationDustSet } from "./RelationDustSet"
import { splitIntoPieces } from "../../utils/utils"
import { NebulaInfoArea } from "./NebulaInfoArea"
import { FileAliasPage } from "./FileAliasPage"
import { mentionContextMenu } from "../../Components/MentionContextMenu"
import { LucideIcon } from "../../Components/utils/Icon"
import { Ellipsis, MapPlus, Scale } from "lucide"
import { ContentContextMenu } from "./ContentContextMenu"
import { ContentRuleMenu } from "./ContentRuleMenu"
import { ContentDivisionLineContainer } from "./EditorPart/ContentDivisionLineContainer"
import { createNebulaByStart } from "../../features"

type TextAnalyzedInfo = {
    selectionStartLine:number,
    selectionStartIndex:number,
    selectionStartLocalIndex:number,
    selectionEndLine:number,
    selectionEndIndex:number,
    selectionEndLocalIndex:number,
    dustInfos:{
        depth:number,
        id:number,
        claim:string
    }[]
}
class TextAnalyzer {
    constructor(private readonly text:HTMLTextAreaElement){}
    analyze(require:(keyof TextAnalyzedInfo)[]){

    }
}
export function ContentEditor(info:{content?:Content}){    
    let isContextMenuOpened = false;
    let updateNeeded = true;
    
    const contentBody = ul({class: "content-body"})();

    async function updateFile(){
        if (!updateNeeded) return;
        if (!context.selection.content) return;

        updateNeeded = false;
        await window.electron.write(`./contents/${context.selection.content.data.title}.md`, context.selection.content.data.dusts.traverse().map(i => "\t".repeat(i.depth) + "- " + i.node.data.claim).join("\n"))
        const arr = await window.electron.getGitChanges(context.selection.content.data.title);
        const dustBlocks = [...contentBody.children as Iterable<HTMLElement>].sort((a, b) => Number(a.dataset.index) - Number(b.dataset.index));
        dustBlocks.forEach(b => delete b.dataset.gitUpdated)

        for (const index of arr){
            if (!dustBlocks[index - 1]) break;
            dustBlocks[index - 1].dataset.gitUpdated = "";
        }

        updateNeeded = true;
    }

    engine.updater.register(updateFile)

    return (
        div({ class: "page" })(
            div({ class: "content-tool-container" })(
                div({ 
                    class: "content-tool-button",
                    onclick: createNebulaByStart
                })(LucideIcon(MapPlus, 24)),
                div({ class: "content-tool-button" })(LucideIcon(Scale, 24)),
                div({ 
                    class: "content-tool-button",
                    onclick: e => {
                        e.stopPropagation();
                        isContextMenuOpened = true
                    }
                })(LucideIcon(Ellipsis, 24))
            ),
            ContentRuleMenu({get opened(){return true}}),
            ContentContextMenu({get opened(){return isContextMenuOpened}, set opened(v){isContextMenuOpened = v}}),
            div({inlineStyle: {marginLeft: "5px", color: "#999"}})(() => `${context.selection.universe?.name ?? ""} / ${context.selection.nebula?.name ?? ""}`),
            div({ class: U(() => `content-editor ${context.selection.content ? "" : "hidden"}`.trim())})(
                Title({
                    get string(){
                        return context.selection.content?.data.title ?? ""
                    },
                    set string(v:string){
                        if (!context.selection.content) return;
                        context.selection.content.data.title = v;
                    }
                }),
                NebulaInfoArea(),
                contentBody,
                ContentDivisionLineContainer({
                    get totalHeight(){
                        return contentBody.scrollHeight;
                    },
                    get dustBlocks(){
                        return [...contentBody.children as Iterable<HTMLElement>].sort((a, b) => Number(a.dataset.index) - Number(b.dataset.index));
                    }
                }),
                DustBlockGitStickContainer({
                    get totalHeight(){
                        return contentBody.scrollHeight;
                    },
                    get dustBlocks(){
                        return [...contentBody.children as Iterable<HTMLElement>].sort((a, b) => Number(a.dataset.index) - Number(b.dataset.index));
                    }
                }),
                ContentText(contentBody),
                RelationDustSet()
            )
        )
    )
}
function ContentText(contentBody:HTMLElement){
    let textFocused = false;
    let prevContent = context.selection.content;
    let newRefContents = new Array<string>();
    let cursorWaitingTime = 2;

    engine.updater.register(() => {
        cursorWaitingTime++;
    })

    const cursor = div({class: U(() => cursorWaitingTime >= 2 ? "text-cursor blink" : "text-cursor")})();
    const tempCursor = span()();
    const cursorStartHighlightBegin = span({inlineStyle: {color: "#00000000"}})();
    const cursorStartHighlightEnd = span({inlineStyle: {color: "#00000000", background: "var(--text-selection-color)"}})();
    const cursorStartHighlight = (
        div({class: "text-selection"})(
            cursorStartHighlightBegin,
            cursorStartHighlightEnd
        )
    )
    const cursorEndHighlightBegin = span({inlineStyle: {color: "#00000000", background: "var(--text-selection-color)"}})();
    const cursorEndHighlightEnd = span({inlineStyle: {color: "#00000000"}})();
    const cursorEndHighlight = (
        div({class: "text-selection"})(
            cursorEndHighlightBegin,
            cursorEndHighlightEnd
        )
    );
    const textWidthMeasure = div({class: "text-width-measure"})();

    function adjustDustBlocks(count:number){
        const dustBlocks = [...contentBody.children as Iterable<HTMLElement>].sort((a, b) => Number(a.dataset.index) - Number(b.dataset.index));
        for (let i = dustBlocks.length - 1; i >= count; i--){
            dustBlocks[i].dataset.isDisposable = "";
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
    function handleCopy(text:HTMLTextAreaElement, e:Event){
        e.preventDefault();
        navigator.clipboard.writeText(
            text.value
                .slice(text.selectionStart, text.selectionEnd)
                .split("\n")
                .map((l, i) => i === 0 ? l : l.slice(l.indexOf("]") + 1))
                .join("\n")
        )
    }
    function handleInsertLine(text:HTMLTextAreaElement, e:KeyboardEvent){
        if (e.isComposing) return;
        const cursorPos = text.selectionStart;
        const lines = text.value.split("\n");
        const beforeLines = text.value.slice(0, cursorPos).split("\n");
        const lineNumber = beforeLines.length;
        for (const block of contentBody.children as Iterable<HTMLElement>){
            const index = Number(block.dataset.index);
            if (index < lineNumber) continue;

            block.dataset.index = index + 1 + "";
        }
        const block = DustBlock(lineNumber);
        block.style.marginLeft = `${2 * getLineDepth(lines[lineNumber - 1])}em`;
        contentBody.append(block);
    }
    function handleMoveDown(text:HTMLTextAreaElement, e:KeyboardEvent){
        if (e.isComposing) return;
        e.preventDefault();
        const cursor = text.selectionStart;
        const before = text.value.slice(0, text.selectionStart);
        const after = text.value.slice(text.selectionStart);
        const currentLine = before.slice(before.lastIndexOf("\n") + 1) + after.slice(0, after.indexOf("\n"));
        const nextLine = after.split("\n")[1]
        
        if (!nextLine) return;

        const currentLineNumber = before.split("\n").length - 1;
        const dustBlocks = [...contentBody.children as Iterable<HTMLElement>].sort((a, b) => Number(a.dataset.index) - Number(b.dataset.index));

        dustBlocks[currentLineNumber + 1].dataset.index = currentLineNumber + "";
        dustBlocks[currentLineNumber].dataset.index = currentLineNumber + 1 + "";
        
        const restBeforeArr = before.split("\n");
        const restBefore = restBeforeArr.slice(0, restBeforeArr.length - 1).join("\n");
        const restAfter = after.split("\n").slice(2).join("\n");

        text.value = (restBefore + "\n" + nextLine).trimStart() + "\n" + currentLine + ("\n" + restAfter).trimEnd();
        text.selectionStart = cursor + nextLine.length + 1;
        text.selectionEnd = text.selectionStart;
    }
    function handleMoveUp(text:HTMLTextAreaElement, e:KeyboardEvent){
        if (e.isComposing) return;
        e.preventDefault();
        const cursor = text.selectionStart;
        const before = text.value.slice(0, text.selectionStart);
        const after = text.value.slice(text.selectionStart);
        const currentLine = before.slice(before.lastIndexOf("\n") + 1) + after.slice(0, after.indexOf("\n"));
        const prevLine = before.split("\n").at(-2);
        
        if (!prevLine) return;

        const currentLineNumber = before.split("\n").length - 1;
        const dustBlocks = [...contentBody.children as Iterable<HTMLElement>].sort((a, b) => Number(a.dataset.index) - Number(b.dataset.index));

        dustBlocks[currentLineNumber - 1].dataset.index = currentLineNumber + "";
        dustBlocks[currentLineNumber].dataset.index = currentLineNumber - 1 + "";
        
        const restBeforeArr = before.split("\n");
        const restBefore = restBeforeArr.slice(0, restBeforeArr.length - 2).join("\n");
        const restAfter = after.split("\n").slice(1).join("\n");

        text.value = (restBefore + "\n" + currentLine).trimStart() + "\n" + prevLine + ("\n" + restAfter).trimEnd();
        text.selectionStart = cursor - prevLine.length - 1;
        text.selectionEnd = text.selectionStart;
    }
    function handleEraseChar(text:HTMLTextAreaElement, e:KeyboardEvent){
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
            if (!line) return;
            if (line.slice(line.indexOf("]") + 1, line.length).split("").some(c => c !== "\t")) return;

            [...contentBody.children as Iterable<HTMLElement>].find(el => el.dataset.index === lineNumber + "")?.remove();
            for (const block of contentBody.children as Iterable<HTMLElement>){
                const index = Number(block.dataset.index);
                if (index < lineNumber) continue;

                block.dataset.index = index - 1 + "";
            }

            text.value = before.slice(0, before.length - line.length) + after;
            text.selectionStart = cursor - line.length;
            text.selectionEnd = text.selectionStart;
        }
    }
    function handleBracketPairing(text:HTMLTextAreaElement, e:KeyboardEvent){
        if (e.isComposing) return;
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

    return (
        textarea({
            class: "content-text",
            spellcheck: false,
            inlineStyle: {
                width: "calc(100% - 44px)"
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

                const content = context.selection.content?.data;
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

                for (const block of contentBody.children as Iterable<HTMLElement>){
                    const index = Number(block.dataset.index);
                    if (index <= lineNumber) continue;

                    block.dataset.index = index + pastedStrLineCount - 1 + "";
                }
                for (let i = 1; i < pastedStrLineCount; i++){
                    const block = DustBlock(lineNumber + i);
                    contentBody.append(block);
                }
            },
            onkeydown: function(e) {
                const text = <HTMLTextAreaElement>this;
                const ctrlKey = (e.ctrlKey || e.metaKey);
                cursorWaitingTime = 0;

                if (ctrlKey && e.shiftKey && e.code === "KeyC") handleCopy(text, e);
                else if (e.code === "Enter") handleInsertLine(text, e);
                else if (e.altKey && e.code === "ArrowDown") handleMoveDown(text, e);
                else if (e.altKey && e.code === "ArrowUp") handleMoveUp(text, e);
                else if (e.code === "Tab") handleIndent(text, e);
                else if (e.code === "Backspace") handleEraseChar(text, e);
                else if (e.code === "BracketLeft" || (e.code === "Digit9" && e.shiftKey)){
                    handleBracketPairing(text, e)
                }
            },
            value: U(text => {
                text.style.translate = `0 ${232 - contentBody.getBoundingClientRect().top}px`;
                if (prevContent !== context.selection.content){
                    prevContent = context.selection.content;

                    if (prevContent){
                        newRefContents = prevContent.data.dusts.traverse().map(i => splitIntoPieces(i.node.data.claim).filter(p => p.kind === "ref").map(p => p.text.slice(2, p.text.length - 2))).flat()
                        text.value = prevContent.data.dusts.traverse()
                            .map(i => `[${i.node.data.id}]${"\t".repeat(i.depth)}${i.node.data.claim}`)
                            .join("\n")
                    }
                }
                const content = context.selection.content?.data;
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

                // get info

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

                // element update

                adjustDustBlocks(lineInfos.length);
                const dustBlocks = [...contentBody.children as Iterable<HTMLElement>].sort((a, b) => Number(a.dataset.index) - Number(b.dataset.index));
                let currentHeight = 0;

                for (let i = 0; i < dustBlocks.length; i++){
                    const block = dustBlocks[i];
                    
                    block.dataset.index = i + "";
                    block.dataset.id = lineInfos[i].id + "";
                    block.dataset.claim = lineInfos[i].claim.replace(/(?<!\\)\\(?!\\)/g, "");
                    block.dataset.depth = lineInfos[i].depth + "";
                    block.style.top = `${currentHeight}px`                            
                    block.style.marginLeft = `${lineInfos[i].depth * 2}rem`;
                    (<HTMLElement>block.children[0]).style.backgroundColor = "";
                    currentHeight += Math.floor(block.scrollHeight) + 10;
                }

                //
                if (textFocused){
                    if (dustBlocks[cursorPosition.line])
                        dustBlocks[cursorPosition.line].dataset.claim = lineInfos[cursorPosition.line].claim;
                }
                //

                contentBody.style.height = currentHeight + "px";

                // determine cursor position

                if (textFocused){
                    const measureTarget = selectionLine.slice(selectionLine.indexOf("]") + 1);
                    if (measureTarget !== textWidthMeasure.innerText.replaceAll(" ", " ")){
                        textWidthMeasure.innerText = selectionLine.slice(selectionLine.indexOf("]") + 1).replaceAll(" ", "\u00A0");
                    }
                    if (!dustBlocks[cursorPosition.line].contains(cursor)){
                        dustBlocks[cursorPosition.line].append(cursor, textWidthMeasure)
                    }
                    textWidthMeasure.append(tempCursor);
                    textWidthMeasure.append(document.createTextNode(text.value.slice(text.selectionStart).split("\n")[0].replaceAll(" ", "\u00A0")))
                    const cursorRect = tempCursor.getBoundingClientRect();
                    const dustBlockRect = dustBlocks[cursorPosition.line].getBoundingClientRect();
                    cursor.style.left = (cursorRect.left - dustBlockRect.left) + "px";
                    cursor.style.top = (cursorRect.top - dustBlockRect.top) + "px";
                    tempCursor.remove();
                    text.style.translate = `0 calc(170px + ${dustBlocks[cursorPosition.line].style.top})`;
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
                               (<HTMLElement>dustBlocks[i].children[0]).style.backgroundColor = "var(--text-selection-color)";
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
        })()
    )
}
function DustBlock(index:number){
    const block:HTMLLIElement = (
        li({
            class: "dust-block",
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
            div({class: "dust-block-text-part"})(
                Repeat(
                    DustPiece,
                    () => {
                        const blockIndex = Number(block.dataset.index);

                        // if ((block.dataset.claim?.length ?? 0) > 5 && !block.dataset.claim?.startsWith("\\")){
                        //     const claim = block.dataset.claim!;
                        //     const similar = context.data.dusts.filter(d => d.claim.startsWith(claim))
                        //     if (similar.length >= 2){
                        //         return [{
                        //             kind: "parallel" as const,
                        //             text: claim,
                        //             blockIndex
                        //         }]
                        //     }
                        // }
                        return (
                            splitIntoPieces(block.dataset.claim ?? "").map(i => {
                                if (i.kind !== "text") return {
                                    kind: i.kind,
                                    text: i.text,
                                    blockIndex
                                };
                                const contents = context.data.contents.all().sort((a, b) => a.title.length - b.title.length);
                                let refedText = i.text;
                                for (const c of contents){
                                    const pieces = splitIntoPieces(refedText);
                                    refedText = pieces.map(p => {
                                        if (p.kind === "text") return p.text.replaceAll(c.title, `[[${c.title}]]`);
                                        else return p.text
                                    }).join("")
                                }
                                return splitIntoPieces(refedText).map(j => j.kind !== "ref" ? ({
                                    kind: j.kind,
                                    text: j.text,
                                    blockIndex
                                }) : ({
                                    kind: "mention" as const,
                                    text: j.text.slice(2, -2),
                                    blockIndex
                                }));
                            }).flat()
                        )
                    }
                )
            ),
            div({class: U(() => context.openedFile === "" ? "dust-block-embed-part" : "hidden")})(
                Repeat(
                    DustEmbed,
                    () => {
                        return splitIntoPieces(block.dataset.claim ?? "")
                            .filter(p => p.kind === "file" && !p.text.endsWith("()}}"))
                    }
                )
            ),
            // div({class: "dust-block-button-part"})(
            //     button({
            //         onclick: () => {
            //             const dust = context.data.dusts.get(Number(block.dataset.id ?? -1));
            //             const destination = context.secondSelection?.content?.data;
            //             if (!dust || !destination) return;
                        
            //             destination.dusts.insert(new TreeNode(dust));
            //         }
            //     })("→")
            // )
        )
    )
    block.dataset.index = index + '';
    return block;
}
function DustPiece(i:{kind:"text"|"ref"|"file"|"mention"|"parallel", text:string, blockIndex:number}) {
    let isValidFile = true;
    engine.updater.register(() => {
        if (i.kind !== "file") return;
        const fileName = i.text.slice(2, -2);
        if (context.data.fileAliases[fileName] === undefined) window.electron.exists(fileName).then(b => isValidFile = b);
        else window.electron.exists(context.data.fileAliases[fileName]).then(b => isValidFile = b);
    })

    return span({
        className: U(() => ({
            text: "",
            ref: "hover-eee",
            file: "hover-eee piece-file",
            mention: "hover-eee",
            parallel: "hover-eee"
        })[i.kind]),
        inlineStyle: U(piece => ({
            color: {
                text: "",
                ref: "skyblue",
                file: "orange",
                mention: "",
                parallel: ""
            }[i.kind],
            background: 
                i.kind === "file" && !isValidFile && !i.text.endsWith("()}}") ? "red" : 
                context.currentPieceElement === piece ? "#eee" : "",
            cursor: i.kind === "text" ? "" : "default",
            textDecoration: 
                i.kind === "mention" ? "skyblue underline 4px" : 
                i.kind === "parallel" ? "" : ""
        })),
        onclick: async function(e) {
            if (i.kind === "text") return;
            e.stopPropagation();
            if (i.kind === "parallel") {
                return;
            }
            if (i.kind === "mention") {
                const pieceElement = this as HTMLElement;
                document.body.append(mentionContextMenu)
                const rect = pieceElement.getBoundingClientRect();
                mentionContextMenu.style.top = rect.top + rect.height + "px";
                mentionContextMenu.style.left = rect.left + "px";
                mentionContextMenu.dataset.contentTitle = i.text;
                return;
            }
            if (i.kind === "ref") {
                const content = context.data.contents.find(c => `[[${c.title}]]` === i.text) ?? context.data.addContent(new Content({title: i.text.slice(2, -2)}));
                if (e.ctrlKey || e.metaKey){
                    context.secondSelection = {
                        universe: context.data.systemUniverse,
                        nebula: context.data.systemUniverse.dayNebula,
                        content: context.data.systemUniverse.dayNebula.tree.traverse().find(info => info.node.data === content)?.node
                    }
                    context.tabs.push(context.secondSelection);
                    context.screenSplit = true;
                    return;
                }
                if (!context.selection.nebula?.tree.traverse().find(i => i.node.data === content)){
                    context.selection.universe = context.data.systemUniverse;
                    context.selection.nebula = context.data.systemUniverse.dayNebula;
                }
                context.selection.content = context.selection.nebula.tree.traverse().find(info => info.node.data === content)?.node;
            }
            if (i.kind === "file"){
                if (e.ctrlKey || e.metaKey) {
                    document.body.append(FileAliasPage())
                    return;
                }
                context.currentPieceElement = this as HTMLElement;
                const content = context.selection.content;
                if (!content) return;
                if (i.text.endsWith("()}}")){
                    const blockIndex = i.blockIndex;
                    const dustTreeArray = content.data.dusts.traverse();
                    const parentDustInfo = dustTreeArray.slice(0, blockIndex).findLast(i => i.depth + 1 === dustTreeArray[blockIndex].depth);
                    const fileName = splitIntoPieces(parentDustInfo?.node.data.claim ?? "").find(p => p.kind === "file" && (p.text.endsWith(".html}}") || context.data.fileAliases[p.text.slice(2, -2)]?.endsWith(".html")))?.text.slice(2, -2) ?? "";
                    const originalFileName = context.data.fileAliases[fileName] ?? fileName;
                    const functionName = i.text.slice(2, i.text.length - 4);

                    if (!originalFileName || originalFileName === "") return;
                    if (context.openedFile !== originalFileName){
                        context.iframeOnload = functionName;
                    }
                    context.openedFile = originalFileName;

                    (frames[context.screenSplit ? 1 : 0] as any)?.[functionName]?.()
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
    })(() => i.text.replaceAll(" ", "\u00A0"))
}
function DustEmbed(info:{text:string}){
    const getValidations = () => {
        const src = info.text.slice(2, -2);
        const extension = src.slice(src.lastIndexOf(".") + 1);
        return {
            img: ["jpg", "png", "gif"].includes(extension),
            audio: ["mp3", "wav"].includes(extension),
            video: ["mp4", "avi"].includes(extension),
            iframe: ["html"].includes(extension)
        }
    }
    return (
        div()(
            img({src: U((i) => {
                if (getValidations().img) return `asset://${info.text.slice(2, -2)}`;
                i.removeAttribute("src");
                return i.src;
            }), class: U(() => getValidations().img ? "" : "hidden")})(),
            audio({src: U(a => {
                if (getValidations().audio) return `asset://${info.text.slice(2, -2)}`;
                a.removeAttribute("src");
                return a.src;
            }), class: U(() => getValidations().audio ? "" : "hidden")})(),
            video({src: U(v => {
                if (getValidations().video) return "asset://" + info.text.slice(2, -2);
                v.removeAttribute("src");
                return v.src;
            }), class: U(() => getValidations().video ? "" : "hidden")})(),
            iframe({src: U(() =>  getValidations().iframe ? ("asset://" + info.text.slice(2, -2)) : ""), class: U(() => getValidations().iframe ? "" : "hidden")})()
        )
    )
}
function DustBlockGitStickContainer(info:{totalHeight:number, dustBlocks:HTMLElement[]}){
    function getGitInfos(){
        return info.dustBlocks.map((d, i, a) => ({
            top: d.style.top,
            height: d.scrollHeight + (a[i + 1]?.dataset.gitUpdated === "" ? 10 : 0) + "px",
            updated: d.dataset.gitUpdated === "",
        }));
    }
    const inlineStyle = U(() => ({
        top: `calc(-${info.totalHeight}px - 15px)`
    }))
    return (
        div({class: "dust-block-git-stick-container", inlineStyle})(
            Repeat(DustBlockGitStick, getGitInfos)
        )
    )
}
function DustBlockGitStick(info:{top:string, height:string, updated:boolean}){
    const style:Attribute<"div">["inlineStyle"] = U(() => ({
        top: info.top,
        height: info.height,
        display: info.updated ? "" : "none"
    }))
    return (
        div({class: "dust-block-git-stick", inlineStyle: style})()
    )
}