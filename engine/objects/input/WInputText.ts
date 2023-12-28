import { WInput } from ".";

export class WInputText extends WInput{
    constructor(limit?:"number"){
        super();
        if (!limit) return;
        this.element.type = limit;
    }
}