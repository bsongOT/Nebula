import { WButton } from "./WButton"
import { WContainer } from "./Container"
import { DOMObject } from "./WebObject"
import "../styles/Detail.css"

export class WDetail extends WContainer{
  private height:number;
  private $collapsed:boolean;
  public get collapsed(){
    return this.$collapsed;
  }
  private set collapsed(v:boolean){
    this.$collapsed = v;
    const content = this.family.children[1]
    if (v){
      this.class.remove("detail-openned");
      content.style.maxHeight = "0";
      content.style.paddingTop = "0";
      content.style.margin = "0";
      content.style.border = "0";
    }
    else{
      this.class.add("detail-openned");
      content.style.maxHeight = content.scrollHeight + "px";
      content.style.paddingTop = "";
      content.style.margin = "";
      content.style.border = "";
    }
  }
  protected constructor(children:[WButton, DOMObject]){
    const [toggle, content] = children
    
    super()
    
    this.family.adoptAll([
      toggle.class.add("detail-toggle")
            .event.onclick(() => {
              this.collapsed = !this.collapsed;
            }),
      content.class.add("detail-content")
    ])
    
    this.$collapsed = true;
    this.collapsed = true;
    this.class.add("detail")
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