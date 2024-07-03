import { div, span } from "@/funcObject"
import { CategoryNebula, Content, Data, Nebula } from "../../data/Data"
import { TreeList } from "./TreeList/StarTreeList"
import { Tree } from "@/data-structure/tree"
import { Dust } from "../../data/components/Dust"
import { U } from "@/engine"

export type CategoryNebulaEditorInfo = {
    nebula: CategoryNebula,
    data: Data
}
export const CategoryNebulaEditor = (info:CategoryNebulaEditorInfo) => {
    const tree = new Tree<Dust | Content>()
    
    /*
    const tree = info.nebula.reference.claims.map(c => c as Dust | Content);
    for (const o of info.nebula.ownerMap){ // o is {dust:Dust, content:Content}
        const dustNode = tree.nodes.find(n => n.data === o.dust)
        const contentNode = new TreeNode<Dust | Content>(o.content)
        tree.insert(contentNode, dustNode)
    }
    */
    
    return div()([
        div({class: "reference-content-input"})([
            div()(() => ""/*info.nebula.reference.name*/),
            div({class: "lock-mark"})()
        ]),
        TreeList({
            startNode: tree.root, 
            itemChildrenBuilder: cp => {
                if (cp instanceof Dust) return [div()(cp.claim)];
                return [
                    div()(cp.title),
                    div({className: U(() => {
                        if (info.data.systemNebulas.lifetime.livings.includes(cp)) return "living";
                        if (info.data.systemNebulas.lifetime.modifieds.includes(cp)) return "modified";
                        if (info.data.systemNebulas.lifetime.news.includes(cp)) return "new";
                        return "dead"
                    })})()
                ]
            }
        })
    ])
}