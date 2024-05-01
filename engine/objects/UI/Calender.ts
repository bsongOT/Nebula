import { span, table, td, tr } from "@/funcObject";
import { range } from "@/utils/utils";

export class Calendar {
  public readonly element;
  public readonly info;
  constructor(attrs:{
    day?: Date,
    onchange?: ()=>void
  }){
    this.info = attrs;
    this.element = table()();
  }

  public update(){
    this.element.innerHTML = "";
    const day = this.info.day ?? new Date();
    const firstDay = new Date(day.getFullYear(), day.getMonth(), 1)

    const weekCells = ["일","월", "화", "수", "목", "금", "토"].map(s => td()(span()(s)))
    const dayCells = range(31).map(s => td()(span()((s + 1).toString())))
    const cells = [
      ...weekCells,
      ...Array(firstDay.getDate()).fill(td()()),
      ...dayCells
    ]

    dayCells[day.getDay() - 1].classList.add("selected")

    for (let i = 0; i < 7; i++){
      const row = tr()();
      for (let j = 0; j < 7; j++){
        row.append(cells[7 * i + j])
      }
      this.element.append(row);
    }
  }
}