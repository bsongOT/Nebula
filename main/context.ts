import { Content, Data, Nebula } from "./data/Data";
import { Universe } from "./data/components/Universe";

const context = {
    data: new Data(),
    selection: {
        universe: undefined as Universe | undefined,
        nebula: undefined as Nebula | undefined,
        content: undefined as Content | undefined
    }
}

export default context;