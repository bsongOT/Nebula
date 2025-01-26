export function Icon(html:string){
    const icon = document.createElementNS("http://www.w3.org/2000/svg", "svg") as Element as HTMLElement;
    const iconAttrs = {
      width: "30",
      height: "30",
      viewBox: "0 0 24 24",
      fill: "white",
      stroke: "black",
      "stroke-width": "1",
      "stroke-linecap": "round"
    } as Record<string, string>
    for (const key in iconAttrs){
      icon.setAttribute(key, iconAttrs[key]);
    }
    icon.innerHTML = html;
    return icon;
}