import { WebObject } from "@/objects";
import { emptyArr } from "@/utils/utils";


export class Calender extends WebObject<any,any>{
  public get value(): any {
    throw new Error("Method not implemented.");
  }
  public set value(v: any) {
    throw new Error("Method not implemented.");
  }
  constructor(){
    super("table")
    let today = new Date();
    (today.getMonth()+1)+"월";

    let blank = (36+today.getDay() - today.getDate())%7;
    let days = [
      "일","월","화","수","목","금","토",
      ...Array(blank).fill(""),
      ...emptyArr(31).map((_,i)=>i+1),
    ];

    const week = emptyArr(7).map(v => "<td></td>").join("");
    const month = emptyArr(7).map(v => `<tr>${week}</tr>`).join("");
    this.element.innerHTML = month;
    
    const tds = this.element.querySelectorAll("td");
    for(let i=0; i < tds.length; i++){
      tds[i].innerText = days[i] ?? "";
      if(days[i] === today.getDate()) 
        tds[i].classList.add("yellow");
    }
  }
}