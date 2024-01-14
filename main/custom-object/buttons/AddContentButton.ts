import {WButton} from "@/objects/"
import {Data} from "../../data/Data"
import { btn } from "@/funcObject"

export const addContentButton = (data:Data)=>{
  const addContent = () => {
    const title = prompt("컨텐츠 제목을 입력하세요", "content")
    if (title === null || title === "") return;

    data.addContent(title, "Story")
  }
  
  return btn("+").input.onclick(addContent)
}