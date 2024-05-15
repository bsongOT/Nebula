import { btn, div, li, slider, span, ul } from "@/funcObject";


export const ImportanceNebulaList = (info: { interval: number; }) => {
  return div()(
    span()("gap"),
    slider({ value: "0" }),
    btn()("-5"), btn()("-3"), btn()("-1"),
    btn()("+1"), btn()("+3"), btn()("+5"),
    ul()(
      li()(span()("Nebula Count")),
      li()(span()("Parent Count")),
      li()(span()("Child Count")),
      li()(span()("Dust Count"))
    )
  );
};
