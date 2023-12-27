import { WButton, WContainer, DOMObject } from ".";
import "../styles/popup.css"

export class Popup extends WContainer{
    private $content:DOMObject;
    private $background:WContainer;
    constructor(children:[WButton, DOMObject]){
        let content: DOMObject;
        let background:WContainer;
        super([
            background = new WContainer().class.add("popup-background").event.onclick(()=>this.hide()),
            children[0].class.add("popup-trigger").event.onclick(()=>this.show()),
            content = children[1].class.add("popup-content")
        ]);
        this.$content = content;
        this.$background = background;
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