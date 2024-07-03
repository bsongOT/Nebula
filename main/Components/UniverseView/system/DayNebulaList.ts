import { btn, div, slider, span } from "@/funcObject";
import { Content, Data } from "../../../data/Data";
import { U, engine } from "@/engine";
import { range } from "@/utils/utils";


export const DayNebulaList = (info: { period:number }, data: Data) => {
  let [from, to] = [0, 0];

  const listItems = new Array<HTMLElement>();

  engine.updater.register(() => {
    const allDay = [
      ...data.systemNebulas.day.add.map(d => d.day.getTime()),
      ...data.systemNebulas.day.modify.map(d => d.day.getTime()),
      ...data.systemNebulas.day.remove.map(d => d.day.getTime())
    ];
    const min = allDay.length <= 0 ? 0 : Math.min(...allDay);
    const max = allDay.length <= 0 ? 0 : Math.max(...allDay);

    listItems.splice(0, listItems.length);
    listItems.push(
      ...range(Math.ceil((max - min) / (1000 * 60 * 60 * 24 * info.period)))
        .map(n => min + 1000 * 60 * 60 * 24 * info.period * n)
        .filter(d => allDay.some(day => d <= day && day < d + (1000 * 60 * 60 * 24 * info.period)))
        .map(d => div({ onclick: () => [from, to] = [d, d + 1000 * 60 * 60 * 24 * info.period] })(
          new Date(d).toISOString().substring(0, 10) + "~")
        )
    );
  });

  return (
    div()([
      span()("Period"),
      slider({ 
        min: "1", 
        max: "100", 
        onchange: e => info.period = Number((<HTMLInputElement>e.target).value),
        value: U(() => info.period.toString()) 
      }),
      div({ class: "period-changer" })([
        btn({ onclick: () => info.period = 1 })("1 day"),
        btn({ onclick: () => info.period = 3 })("3 days"),
        btn({ onclick: () => info.period = 7 })("1 week"),
        btn({ onclick: () => info.period = 14 })("2 weeks"),
        btn({ onclick: () => info.period = 30 })("1 month")
      ]),
      div()(listItems)
    ])
  );
};
