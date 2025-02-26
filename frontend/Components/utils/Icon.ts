import { div } from "@/funcObject";
import { createElement, SVGProps } from "lucide";

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
export function LucideIcon(icon:[tag:string, attrs:SVGProps][], size?:number){
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg") as Element as HTMLElement;
    const iconAttrs = {
        width: size ? `${size}px` : "1em",
        height: size ? `${size}px` : "1em",
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        "stroke-width": "2",
        "stroke-linecap": "round"
    } as Record<string, string>
    for (const key in iconAttrs){
        svg.setAttribute(key, iconAttrs[key]);
    }

    svg.append(...icon.map(i => createElement(i)))

    return svg;
}