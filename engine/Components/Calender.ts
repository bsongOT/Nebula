import { span, table, td, tr } from "@/funcObject";
import { range } from "@/utils/utils";

type CalendarInfo = {
  day?: Date,
  onchange?: () => void
}
function CalendarCell(info:{data:string[][], line:number, index:number, day:Date}){
  return td()(info.data[info.line][info.index])
}
function CalendarRow(info:{data:string[][], line:number, day:Date}){
  return tr()(
    info.data.map((_, i) => CalendarCell({
      data: info.data,
      line: info.line,
      day: info.day,
      index: i
    }))
  )
}
export function Calendar(info:CalendarInfo) {
  const day = info.day ?? new Date();
  const firstDay = new Date(day.getFullYear(), day.getMonth(), 1)

  const weeks = ["일","월", "화", "수", "목", "금", "토"]
  const days = range(31).map(s => (s + 1).toString())
  const cellStrings = [
    ...weeks,
    ...range(firstDay.getDate()).map(n => n.toString()),
    ...days
  ]
  const data = range(Math.ceil(cellStrings.length / 7)).map((_, i) => cellStrings.slice(7 * i, 7 * (i + 1)))

  return table()(data.map((_, i) => CalendarRow({data: data, line: i, day: day})))
}