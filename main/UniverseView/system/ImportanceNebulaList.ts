import { btn, div, li, slider, span, ul } from "@/funcObject";


export const ImportanceNebulaList = (info: { interval: number; }) => {
  return div()([
    span()("gap"),
    slider({ value: "0" }),
    btn()("-5"), btn()("-3"), btn()("-1"),
    btn()("+1"), btn()("+3"), btn()("+5"),
    ul()([
      li()("Nebula Count"),
      li()("Parent Count"),
      li()("Child Count"),
      li()("Dust Count")
    ])
  ]);
};
