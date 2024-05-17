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
    private message = "";
    private isShown = false;
    public logger(){
        return div()([
            btn({onclick: () => this.isShown = false})("X"),
            div({}, {innerText: () => this.message})()
        ])
    }
    public log(message?:any){
        this.message += message + "\n";
        this.isShown = true;
    }
    public erase(){
        this.message = "";
    }
}

export const engine = {
    updater: new Updater(),
    debug: new Debug()
}