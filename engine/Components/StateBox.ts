import { span } from "@/funcObject";
import "../styles/StateBox.css"

type StateBoxInfo = {
  states: string[],
  index?: number
}
export const StateBox = (info:StateBoxInfo) => {
  const clamp = () => {
    const idx = info.index ?? 0;
    const len = info.states.length;
    if (idx >= 0) return idx % len;
    return (len - ((-idx) % len)) % len
  }
  return (
    span({
      class: "state-box", 
      onclick: () => info.index = (info.index ?? 0) + 1
    })(
      () => info.states[clamp()]
    )
  );
}