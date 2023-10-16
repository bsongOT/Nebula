import { ButtonObject, Container, WebObject } from ".";
import "../styles/popup.css"

export class Popup extends Container{
    private $content:WebObject<any,any>;
    private $background:Container;
    constructor(children:[ButtonObject, WebObject<any,any>]){
        let content: WebObject<any,any>;
        let background:Container;
        super([
            background = new Container().addClass("popup-background").onclick(()=>this.hide()),
            children[0].addClass("popup-trigger").onclick(()=>this.show()),
            content = children[1].addClass("popup-content")
        ]);
        this.$content = content;
        this.$background = background;
        this.addClass("popup")
        this.hide()
    }
    public hide(){
        this.$content.addClass("popup-hidden");
        this.$background.addClass("popup-hidden");
        return this;
    }
    public show(){
        this.$content.removeClass("popup-hidden");
        this.$background.removeClass("popup-hidden");
        return this;
    }
}