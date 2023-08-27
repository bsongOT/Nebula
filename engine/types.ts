export type WoOption = {
  class?:string,
  onclick?:Function,
  value?: string
}
export type IoOption = ChangableObjectOption & {
  type?:"text"|"number"|"checkbox"|"radio"
}
export type SelectableObjectOption = WoOption & {
  onselect?: Function
}
export type ChangableObjectOption = WoOption & {
  onchange?: Function
}
export type WoTag = (keyof HTMLElementTagNameMap) | "none" | undefined;