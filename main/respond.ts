import { data } from "./data/Data";

export function receiveNewContent(){
    const title = prompt("컨텐츠 제목을 입력하세요.", "content")
    if (title === null || title.trim() === "") return;

    data.addContent(title, "Story")
}