import {WButton} from "@/objects/"
import {data} from "../../data/Data"

export const addContentButton = ()=>{
  const addContent = () => {
    const title = prompt("컨텐츠 제목을 입력하세요", "content")
    if (title === null || title === "") return;

    data.addContent(title, "Story")
  }
  
  return new WButton("+").event.onclick(addContent)
}