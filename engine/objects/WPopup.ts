import { WButton, WContainer } from ".";
import "../styles/popup.css"
import { DOMObject } from "./DOMObject";

export class WPopup extends WContainer{
    private $content:DOMObject;
    private $background:WContainer;
    constructor(trigger:WButton, content:DOMObject){
        super()
        this.family.adoptAll([
            this.$background = new WContainer()
                .class.add("popup-background")
                .input.onclick(()=>this.hide()),
            trigger
                .class.add("popup-trigger")
                .input.onclick(()=>this.show()),
            this.$content = content.class.add("popup-content")
        ]);
        this.class.add("popup")
        this.hide()
    }
    public hide(){
        this.$content.class.add("popup-hidden");
        this.$background.class.add("popup-hidden");
        return this;
    }
    public show(){
        this.$content.class.remove("popup-hidden");
        this.$background.class.remove("popup-hidden");
        return this;
    }
}