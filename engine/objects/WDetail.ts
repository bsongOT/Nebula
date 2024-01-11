import { WButton } from "./WButton"
import { WContainer } from "./WContainer"
import { DOMObject } from "./DOMObject";
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
      this.class.add("detail-collapsed");
    }
    else{
      this.class.remove("detail-collapsed");
      content.style.maxHeight(`${content.style.scrollHeight}px`);
    }
  }
  constructor(toggle:WButton, content:DOMObject<any>){
    super()
    
    this.family.adoptAll([
      toggle.class.add("detail-toggle")
            .input.onclick(() => {
              this.collapsed = !this.collapsed;
            }),
      content.class.add("detail-content")
    ])
    
    this.$collapsed = true;
    this.collapsed = true;
    this.class.add("detail")
    this.height = content.style.scrollHeight;

    const iter = setInterval(()=>{
      if (!this) clearInterval(iter)
      if (this.collapsed) return;
      
      const visibleSize = content.style.scrollHeight

      content.style
        .height("auto")
        .maxHeight(`${visibleSize}px`)
        .height(`${Math.max(this.height, visibleSize)}px`)
      
      if (Math.abs(this.height - visibleSize) > 0.1)
        this.height = visibleSize;
    }, 50)
  }
}