import { btn, div, inputText, span } from "@/funcObject";
import { Coord } from "@/utils/math/coord-system";
import { Data, Nebula } from "../../data/Data";
import { U } from "@/engine";
import context from "../../context";
import { Universe } from "../../data/components/Universe";

export type PickerInfo = {
  pickedPosition?: Coord,
  size: number,
  viewPoint: Coord
}
export function Picker(info: PickerInfo) {
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
  const onClickNew = () => {
    if (!info.pickedPosition) return;
    const u = new Universe()
    const n = new Nebula()
  
    context.data.universes.add(u)
    context.data.addNebula(n, {
      universe: u,
      position: info.pickedPosition.add(info.viewPoint)
    })
    info.pickedPosition = undefined;
  };

  return div({ 
    inlineStyle: U(getPosition), 
    className: U(() => `cell-picker ${info.pickedPosition ? "" : "hidden"}`)
  })([
    div({onclick: onClickNew})("New Universe"),
    div()("Move here")
  ]);
}
