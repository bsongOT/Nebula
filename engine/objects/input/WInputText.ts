import { DOMFamily } from "@/factors/families/DOMFamily";
import { WInput } from ".";
import { DOMObject } from "../WebObject";

export class WInputText extends WInput{
    public readonly family!: DOMFamily<never, DOMObject, WInputText>;
    constructor(limit?:"number"){
        super();
        if (!limit) return;
        this.element.type = limit;
    }
}