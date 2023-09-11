import { InputObject } from "..";

export class InputText extends InputObject{
    constructor(limit?:"number"){
        super();
        if (!limit) return;
        this.element.type = limit;
    }
}