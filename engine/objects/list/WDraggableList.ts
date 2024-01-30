import { Family } from "@/factors/Family";
import { WDraggableItem } from "./WDraggableItem";
import { WListView } from "./WListView";
import { HTMLObject } from "../HTMLObject";

export class WDraggableList<T> extends WListView<T>{
    public draggee:WDraggableItem<T>|undefined;
    public readonly family!:Family<WDraggableItem<T>, HTMLObject, this>
}