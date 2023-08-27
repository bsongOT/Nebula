import {ButtonObject} from "../"
import {data} from "../../data/Data"

export class AddContentButton extends ButtonObject{
  constructor(option){
    super("+", option);
  }
  click() {
    super.click();
    const title = prompt("컨텐츠 제목을 입력하세요", "content")
    if (title === null || title === "") return;
    
    data.addContent(title, "Story")
    
    this.option.onadded?.()
  }
}