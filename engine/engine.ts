import { btn, div, li, span, ul } from "./funcObject";

class Updater {
    private list:(()=>void)[] = []
    private loop: NodeJS.Timeout | undefined;
    register(func:()=>void){
        this.list.push(func)
        if (this.loop) clearInterval(this.loop)
        this.loop = setInterval(
            () => {
                this.list.forEach(l => l())
            }
        , 100)
    }
}

class Debug {
    public element:HTMLElement;
    private message:HTMLElement;
    constructor(){
        this.message = ul()()
        this.element = div()(
            btn({onclick: () => this.element.style.display = "none"})("X"),
            this.message
        )
    }
    public log(message?:any){
        this.element.style.display = "block";
        this.message.append(li()(span()(message)))
    }
    public erase(){
        this.message.innerHTML = "";
    }
}

export const engine = {
    updater: new Updater(),
    debug: new Debug()
}