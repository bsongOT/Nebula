import { Tree, TreeNode } from "@/data-structure/tree";
import { Repeat, U } from "@/engine";
import { div, inputText, li, span, ul } from "@/funcObject";
import context from "../../context";
import { Relation } from "../../../backend/data/components/Relation";
import { Content } from "../../../backend/data/Data";
import { Dust } from "../../../backend/data/components/Dust";

export function RelationDustSet(){
    const has = <T>(tree:Tree<T>, node:TreeNode<T>) => tree.traverse().some(i => i.node.data === node);
    return (
        ul({inlineStyle: {padding: "0", margin: "0"}})(
            Repeat(RelationDustSingle,
            () => {
                if (!context.selection.content) return [];

                const rels1 = context.data.relations.filter(r => has(r.mainTree.tree, context.selection.content!));
                const rels2 = context.data.relations.filter(r => has(r.secondTree.tree, context.selection.content!));
                return [
                    ...rels1.map(r => ({
                        relation: r,
                        opponent: r.secondTree.tree.leafs,
                        from: "main" as "main" | "second"
                    })),
                    ...rels2.map(r => ({
                        relation: r,
                        opponent: r.mainTree.tree.leafs,
                        from: "second" as "main" | "second"
                    }))
                ]
            }
        ))
    )
}
function RelationDustSingle(info:{relation:Relation, opponent:TreeNode<Content>[], from:"main"|"second"}){
    return (
        li({inlineStyle: {listStyle: "none"}})([
            div({inlineStyle: {display: "flex", alignItems: "center", marginLeft: "10px"}})([
                div({inlineStyle: {height: "2px", width: "10px", background: "black"}})(),
                div({inlineStyle: {margin: "0 3px"}})(() => info.from === 'main' ? info.relation.secondTree.name : info.relation.mainTree.name),
                div({inlineStyle: {height: "2px", flexGrow: "1", background: "black"}})(),
            ]),
            ul({inlineStyle: {padding: "0"}})(Repeat(RelationDust, () => context.selection.content ? info.opponent.map(c => ({
                relation: info.relation,
                main: info.from === 'main' ? context.selection.content! : c,
                second: info.from === 'main' ? c : context.selection.content!
            })) : []))
        ])
    )
}
function RelationDust(info:{relation:Relation, main:TreeNode<Content>, second:TreeNode<Content>}){
    let isInputting = false;
    return (
        ul({inlineStyle: {listStyle: "disc"}})([
            li()([
                span({
                    class: "relation-dust-title hover-skyblue",
                    onclick: () => {
                        context.selection.nebula = context.selection.content === info.main ? info.relation.secondTree : info.relation.mainTree;
                        context.selection.content = context.selection.content === info.main ? info.second : info.main
                    }
                })(() => context.selection.content === info.main ? info.second.data.title : info.main.data.title)
            ]),
            li({inlineStyle: {marginLeft: "20px"}})([
                inputText({
                    value: U(text => {
                        if (isInputting) return text.value;
                        const cell = info.relation.table.find(i => i.main === info.main.data && i.second === info.second.data)?.state;
                        if (!cell) return '';
                        if (typeof cell === 'number') return "";
                        return cell.claim;
                    }),
                    inlineStyle: {
                        width: "100%",
                        outline: "none",
                        border: "none"
                    },
                    oninput: function(e) {
                        const text = this as HTMLInputElement;
                        const cell = info.relation.table.find(i => i.main === info.main.data && i.second === info.second.data);
                        const realCell = cell ?? {
                            main: info.main.data,
                            second: info.second.data,
                            state: new Dust({claim: text.value})
                        }
                        if (!cell) info.relation.table.push(realCell);
                        if (realCell.state === null){
                            realCell.state = context.data.dusts.add(new Dust({claim: text.value}))
                            return;
                        }
                        realCell.state.claim = text.value;
                    },
                    onfocus: () => {
                        isInputting = true;
                    },
                    onblur: () => {
                        isInputting = false;
                    }
                })()
            ])
        ])
    )
}