export class ShortcutManager {
    private started:boolean = false;
    start(){
        if (this.started) return console.error("ShortcutManager is already started.");
        document.addEventListener("keydown", e => {
            const ctrlKey = e.ctrlKey || e.metaKey;
            if (ctrlKey){
                
            }
        })
        document.addEventListener("keyup", e => {

        })
        this.started = true;
    }
}