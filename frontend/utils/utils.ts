import { Attribute, button, div, inputText } from "@/funcObject";

export function splitIntoPieces(claim:string){
    const arr = new Array<{kind:"text"|"ref"|"file", start:number, end:number}>()
    let contentRefStart = -1;
    let fileStart = -1;
    if (claim.length === 0){
        return [{
            kind: "text" as "text",
            text: " "
        }]
    }
    for (let i = 0; i < claim.length; i++){
        if (claim[i] + claim[i + 1] === "[[" && claim[i - 1] !== "\\" && claim[i + 2] !== "]") {
            contentRefStart = i;
            fileStart = -1;
        }
        else if (claim[i - 1] + claim[i] === "]]" && claim[i - 2] !== "\\" && contentRefStart >= 0) {
            arr.push({
                kind: "text",
                start: arr[arr.length - 1]?.end ?? 0,
                end: contentRefStart
            },{
                kind: "ref",
                start: contentRefStart,
                end: i + 1
            })
            contentRefStart = -1;
        }
        else if (claim[i] + claim[i + 1] === "{{" && claim[i - 1] !== "\\" && claim[i + 2] !== "}"){
            contentRefStart = -1;
            fileStart = i;
        }
        else if (claim[i - 1] + claim[i] === "}}" && claim[i - 2] !== "\\" && fileStart >= 0){
            arr.push({
                kind: "text",
                start: arr[arr.length - 1]?.end ?? 0,
                end: fileStart
            },{
                kind: "file",
                start: fileStart,
                end: i + 1
            })
            fileStart = -1;
        }
    }
    if ((arr[arr.length - 1]?.end ?? 0) < claim.length) {
        arr.push({
            kind: "text",
            start: arr[arr.length - 1]?.end ?? 0,
            end: claim.length
        })
    }
    return arr.filter(i => i.end >= 0 && i.start >= 0).map(i => ({
        kind: i.kind,
        text: claim.slice(i.start, i.end)
    }))
}
export function receiveMessage(comment:string){
    const style:Attribute<"div">["inlineStyle"] = {
        position: 'fixed',
        display: "flex",
        zIndex: "2",
        backdropFilter: "brightness(80%)",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        height: "100%",
        marginLeft: "-10px"
    }
    const winStyle:Attribute<"div">["inlineStyle"] = {
        background: "white",
        padding: '10px',
        boxShadow: '2px 2px 4px #ccc'
    }
    return new Promise<string>(resolve => {
        let message = "";
        const receiver = (
            div({inlineStyle: style})(
                div({inlineStyle: winStyle})(
                    div()(comment),
                    inputText({oninput: function(){ message = (this as HTMLInputElement).value} })(),
                    button({onclick: () => {
                        receiver.remove();
                        resolve(message);
                    }})("확인")
                )
            )
        );
        document.body.append(receiver)
    })
}