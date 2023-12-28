import { EventQueue } from "./Event";

export class Input<T> {
    protected readonly obj: T;
    public readonly click: EventQueue<() => void>;
    public readonly contextmenu: EventQueue<() => void>;
    public readonly doubleclick: EventQueue<() => void>;

    public static new<T>(obj: T) {
        return new Input(obj);
    }
    private constructor(obj: T) {
        this.obj = obj;
        this.click = new EventQueue();
        this.contextmenu = new EventQueue();
        this.doubleclick = new EventQueue();
    }
    public onclick(onclick: () => void) {
        this.click.modify(onclick);
        return this.obj;
    }
    public oncontextmenu(oncontextmenu: () => void) {
        this.contextmenu.modify(oncontextmenu);
        return this.obj;
    }
    public ondoubleclick(ondoubleclick: () => void) {
        this.doubleclick.modify(ondoubleclick);
    }
}
