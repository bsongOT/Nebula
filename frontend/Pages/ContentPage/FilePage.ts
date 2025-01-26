import { engine } from "@/engine";
import { Attribute, button, div } from "@/funcObject"
import context from "../../context";

export function FilePage(){
    const attr:Attribute<"div"> = {
        className: "page",
        inlineStyle: {
            position: "relative",
            paddingTop: "50px"
        }
    }
    const closeButtonAttr:Attribute<"button"> = {
        className: "hover-ccc",
        inlineStyle: {
            background: "none",
            border: "none",
            borderRadius: "50%",
            width: '30px',
            height: "30px",
            position: "absolute",
            left: "5px",
            top: "5px"
        },
        onclick: () => {
            context.openedFile = "";
        }
    }

    const img = document.createElement("img");
    const video = document.createElement("video");
    const audio = document.createElement("audio");
    const iframe = document.createElement("iframe");

    iframe.onload = () => {
        if (context.iframeOnload === "") return;
        (iframe.contentWindow as any)[context.iframeOnload]?.()
    }

    engine.updater.register(() => {
        const src = "asset://" + context.openedFile;
        const extension = src.slice(src.lastIndexOf(".") + 1)
        img.style.display = "none";
        video.style.display = "none";
        audio.style.display = "none";
        iframe.style.display = "none";
        if (["jpg", "png", "gif"].includes(extension)){
            img.style.display = "";
            if (img.src !== src) img.src = src;
        }
        else if (["mp4", "avi"].includes(extension)){
            video.style.display = "";
            if (video.src !== src) video.src = src;
        }
        else if (["mp3", "wav"].includes(extension)){
            audio.style.display = "";
            if (audio.src !== src) audio.src = src;
        }
        else if (["html"].includes(extension)){
            iframe.style.display = "";
            if (iframe.src !== src) iframe.src = src;
        }
    })
    return (
        div(attr)(
            button(closeButtonAttr)("X"),
            img,
            video,
            audio,
            iframe
        )
    )
}