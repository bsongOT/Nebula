import { btn, div, inputText, span } from "@/funcObject";
import { Coord } from "@/utils/math/coord-system";
import { Data } from "../../data/Data";
import { insertAt } from "./universeMap";


export function Picker(info: { pickedPosition?: Coord; size: number; }, data: Data) {
  let input = "";
  function getPosition() {
    const style = {
      left: "0",
      top: "0"
    };

    const pos = info.pickedPosition;
    if (!pos) return style;

    if (pos.x >= info.size / 2) {
      style.left = `${100 * (pos.x - 8) / info.size}%`;
    }
    else {
      style.left = `${100 * (pos.x + 1) / info.size}%`;
    }
    if (pos.y >= info.size / 2) {
      style.top = `${100 * (pos.y - 4) / info.size}%`;
    }
    else {
      style.top = `${100 * (pos.y + 1) / info.size}%`;
    }

    return style;
  }
  const onClickClose = () => info.pickedPosition = undefined;
  const onClickOK = () => {
    if (info.pickedPosition)
      insertAt(data, info.pickedPosition, input);
    info.pickedPosition = undefined;
  };

  return div({}, { inlineStyle: getPosition, className: () => `cell-picker ${info.pickedPosition ? "" : "hidden"}` })([
    div({ class: "picker-top" })([
      span()("New Universe"),
      btn({ class: "close-button", onclick: onClickClose })("X"),
    ]),
    inputText({ onchange: e => input = (<HTMLInputElement>e.target).value })(),
    btn({ class: "ok-button", onclick: onClickOK })("확인")
  ]);
}
