import { DOMFamily } from "@/factors/families/DOMFamily";
import { DOMObject } from "../WebObject";
import { WDraggableItem } from "./WDraggableItem";
import { WListView } from "./WListView";
import { EventInvoker } from "@/factors/events/Event";

export class WDraggableList<T> extends WListView<T>{
    public draggee:WDraggableItem<T>|undefined;
    public family!:DOMFamily<WDraggableItem<T>, DOMObject, WDraggableList<T>>
    public event!:EventInvoker<WDraggableList<T>>
    public static new<T>(){
        const dl = new WDraggableList<T>()

        dl.family = new DOMFamily(dl, dl.element)
        dl.event = new EventInvoker<WDraggableList<T>>(dl, dl.element)
        dl.init()

        return dl;
    }
    protected constructor(){
        super()
    }
    protected init(){
        super.init()
    }
}