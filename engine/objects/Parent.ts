import { div } from "@/funcObject";
import { engine } from "@/engine";


export function Parent(info: Partial<HTMLElement> & { childArray: HTMLElement[]; }) {
  const obj = div()();
  const mustUpdate = () => {
    if (obj.children.length !== info.childArray.length) return true;
    for (let i = 0; i < info.childArray.length; i++) {
      if (obj.children[i] !== info.childArray[i]) return true;
    }
    return false;
  };

  engine.updater.register(() => {
    if (!mustUpdate()) return;
    obj.innerHTML = "";
    obj.append(...info.childArray);
  });

  return obj;
}
