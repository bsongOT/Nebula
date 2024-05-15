import { btn, div, slider, span } from "@/funcObject";
import { Parent } from "@/objects/Parent";
import { Content, Data } from "../../data/Data";
import { engine } from "@/engine";
import { range } from "@/utils/utils";


export const DayNebulaList = (info: { data: Data; }) => {
  const listInfo = {
    datas: info.data.systemNebulas.day.add.filter(i => i.day).map(i => i.content),
    page: 1,
    keyword: "",
    capacity: 15,
    itemChildrenBuilder: (c: Content) => [
      span()(c.title)
    ],
    filter: (c: Content, s: string) => c.title.includes(s)
  };
  let period = 1;
  let [from, to] = [0, 0];

  const listItems = new Array<HTMLElement>();

  engine.updater.register(() => {
    const allDay = [
      ...info.data.systemNebulas.day.add.map(d => d.day.getTime()),
      ...info.data.systemNebulas.day.modify.map(d => d.day.getTime()),
      ...info.data.systemNebulas.day.remove.map(d => d.day.getTime())
    ];
    const min = Math.min(...allDay);
    const max = Math.max(...allDay);

    listItems.splice(0, listItems.length);
    listItems.push(
      ...range(Math.ceil((max - min) / (1000 * 60 * 60 * 24 * period)))
        .map(n => min + 1000 * 60 * 60 * 24 * period * n)
        .filter(d => allDay.some(day => d <= day && day < d + (1000 * 60 * 60 * 24 * period)))
        .map(d => div({ onclick: () => [from, to] = [d, d + 1000 * 60 * 60 * 24 * period] })(
          span()(new Date(d).toISOString().substring(0, 10) + "~")
        ))
    );
  });

  return div()(
    span()("Period"),
    slider({ min: "1", max: "100", onchange: e => period = Number((<HTMLInputElement>e.target).value) }, { value: () => period.toString() }),
    div({ class: "period-changer" })(
      btn({ onclick: () => period = 1 })("1 day"),
      btn({ onclick: () => period = 3 })("3 days"),
      btn({ onclick: () => period = 7 })("1 week"),
      btn({ onclick: () => period = 14 })("2 weeks"),
      btn({ onclick: () => period = 30 })("1 month")
    ),
    Parent({ childArray: listItems })
  );
};
