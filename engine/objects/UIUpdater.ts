import { engine } from "@/engine";

export type Functionize<T> = {
  [key in keyof T]: (element:T)=>T[key]
}
function update<T extends HTMLElement>(element:T, attrs:Partial<Functionize<T>>){
  if (!document.contains(element)) return;

  for (const k in attrs){
    const key = k as keyof Partial<Functionize<T>>;
    const data = attrs[key]?.(element);

    if (!data) continue;
    if (element[key] === data) continue;
    element[key] = data;
  }
}
export function u<T extends HTMLElement>(element:T){
  return (attrs:Partial<Functionize<T>>) => {
    engine.updater.register(() => update(element, attrs))
    return element
  }
}