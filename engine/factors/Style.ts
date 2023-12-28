type CSSDisplay = 
    "none" | "block" | "inline" |
    "inline-block" | "flex" | "inline-flex" |
    "grid" | "inline-grid" | "flow-root" |
    "contents" | "table" | "table-row" | 
    "list-item" |"inherit" | "initial" | 
    "revert" | "revert-layer" | "unset"|
    "flexbox";
type CSSNumberSize = `${number}${"px"|"%"|"cm"|"em"|"vw"|"vh"}`
type CSSMaxSize = 
    "none" | "auto" | "max-content"|
    "min-content" | "fit-content"|CSSNumberSize
type CSSSize = "auto" | CSSNumberSize
export class Style{
    private element:HTMLElement;
    public get scrollHeight(){
        return this.element.scrollHeight;
    }
    public static new(element:HTMLElement){
        return new Style(element)
    }
    private constructor(element:HTMLElement){
        this.element = element;
    }
    public display(value:CSSDisplay){
        this.element.style.display = value;
        return this;
    }
    public maxHeight(value:CSSMaxSize){
        this.element.style.maxHeight = value;
        return this;
    }
    public height(value:CSSSize){
        this.element.style.height = value;
        return this;
    }
}