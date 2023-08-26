import {ButtonObject} from "../objects/index.js"
import {contents, Content} from "../../data/Data.js"

export class AddContentButton extends ButtonObject{
  #onadded;
  constructor(option){
    super("+");
    this.#onadded = option.onadded;
  }
  click() {
    super.click();
    const title = prompt("컨텐츠 제목을 입력하세요", "content")
    if (title === null || title === "") return;
    
    contents.push(new Content(
        title, "idea", contents.length))
    
    this.#onadded?.()
  }
}