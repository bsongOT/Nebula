import {ButtonObject} from "../"
import {data} from "../../data/Data"

export class AddContentButton extends ButtonObject{
  public constructor(){
    super("+");
    this.onclick(()=>{})
  }
  public onclick(onclick:()=>void) {
    super.onclick(()=>{
      const title = prompt("컨텐츠 제목을 입력하세요", "content")
      if (title === null || title === "") return;
    
      data.addContent(title, "Story")
    
      onclick()
    })
    return this;
  }
}