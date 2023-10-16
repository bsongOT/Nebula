import { ButtonObject } from "./ButtonObject"
import { Container } from "./Container"
import { WebObject } from "./WebObject"
import "../styles/Detail.css"

export class Detail extends Container{
  private height:number;
  private $collapsed:boolean;
  public get collapsed(){
    return this.$collapsed;
  }
  private set collapsed(v:boolean){
    this.$collapsed = v;
    const content = this.children[1]
    if (v){
      this.removeClass("detail-openned");
      content.style.maxHeight = "0";
      content.style.paddingTop = "0";
      content.style.margin = "0";
      content.style.border = "0";
    }
    else{
      this.addClass("detail-openned");
      content.style.maxHeight = content.scrollHeight + "px";
      content.style.paddingTop = "";
      content.style.margin = "";
      content.style.border = "";
    }
  }
  constructor(children:[ButtonObject, WebObject<any,any>]){
    const [toggle, content] = children
    super([
      toggle.addClass("detail-toggle").onclick(()=>{
        this.collapsed = !this.collapsed;
      }),
      content.addClass("detail-content")
    ])
    this.collapsed = true;
    this.addClass("detail")
    this.height = content.scrollHeight;

    const iter = setInterval(()=>{
      if (!this) clearInterval(iter)
      if (this.collapsed) return;
      
      content.style.height = "auto";
      content.style.maxHeight = content.scrollHeight + "px";
      content.style.height = Math.max(this.height, content.scrollHeight) + "px"
      if (Math.abs(this.height - content.scrollHeight) > 0.1)
        this.height = content.scrollHeight;
    }, 50)
  }
}