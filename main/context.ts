import { Content, Data, Nebula } from "./data/Data";
import { Relation } from "./data/components/Relation";
import { Universe } from "./data/components/Universe";

const context = {
    data: new Data(),
    selection: {
        universe: undefined as Universe | undefined,
        relation: undefined as Relation | undefined,
        nebula: undefined as Nebula | undefined,
        content: undefined as Content | undefined
    },
    importers: new Array<Nebula>()
}

export default context;