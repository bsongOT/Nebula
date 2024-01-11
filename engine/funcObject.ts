import { WContainer } from "./objects";
import { DOMObject } from "./objects/DOMObject";

export const div = (...children:DOMObject<any>[]) => (
    new WContainer().family.adoptAll(children)
)