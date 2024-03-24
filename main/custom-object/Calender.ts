import { span, table, td, tr } from "@/funcObject";

export const calendar = (attribute:{day: Date}) => {
  const obj = table()()
  
  setInterval(()=>{
    obj.innerHTML = ""
    const firstDay = new Date(
      attribute.day.getFullYear(),
      attribute.day.getMonth(),
      1
    )
    const weekCells = ["일","월", "화", "수", "목", "금", "토"].map(s => td()(span()(s)))
    const dayCells = Array(31).fill(0).map((_, i) => i+1).map(s => td()(span()(s.toString())))
    const cells = [
      ...weekCells,
      ...Array(firstDay.getDate()).fill(td()()),
      ...dayCells
    ]

    dayCells[attribute.day.getDay() - 1].classList.add("selected")

    for (let i = 0; i < 7; i++){
      for (let j = 0; j < 7; j++){
        (<HTMLElement>obj.children[i]).append(
          cells[7 * i + j]
        )
      }
    }
  }, 100)
}