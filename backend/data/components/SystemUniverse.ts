import { H } from "@/utils/math/coord-system";
import { Content, Data, Nebula } from "../Data";
import { Universe } from "./Universe";
import { TreeNode } from "@/data-structure/tree";
import { splitIntoPieces } from "../../../frontend/utils/utils";

export class SystemUniverse extends Universe {
    public readonly dayNebula;
    public readonly isolatedNebula;
    public readonly importanceNebula;
    public readonly mentionNebula;

    private data;

    constructor(data: Data, loadedData:{dayNebula:Nebula}) {
        super({ name: "시스템" });
        
        this.data = data;
        this.dayNebula = loadedData.dayNebula;
        this.isolatedNebula = this.getIsolatedNebula();
        this.importanceNebula = this.getImportanceNebula();
        this.mentionNebula = this.getMentionNebula();
        
        this.nebulas.push(
            this.dayNebula,
            this.isolatedNebula,
            this.importanceNebula,
            this.mentionNebula
        )
    }
    
    private getIsolatedNebula() {
        const neb = new Nebula({ id: -1, name: "고립" })
        const nebulas = this.data.nebulas.all();
        const contents = this.data.contents;
        const isolatedContents = (
            contents.filter(
                c => nebulas.length === 0 || nebulas.every(
                    n => !n.tree.traverse().map(i => i.node.data).includes(c)
                )
            )
        )
        for (const c of isolatedContents) {
            neb.tree.insert(new TreeNode(c))
        }

        return neb;
    }
    private getImportanceNebula() {
        const neb = new Nebula({ id: -3, name: "중요도" });
        const contents = this.data.contents;
        const nebulas = this.data.nebulas;
        const nebulaCountList = (
            contents.map(c => ({
                count: nebulas.filter(n => n.tree.traverse().map(i => i.node.data).includes(c)).length,
                content: c
            }))
        )
        const parentCountList = (
            contents.map(c => ({
                count: nebulas.filter(
                    neb => neb.tree.traverse().map(i => i.node).some(
                        n => n.children.some(ch => ch.data === c)
                    )
                ).length,
                content: c
            }))
        )
        const childCountList = (
            contents.map(c => ({
                count: nebulas.filter(
                    n => n.tree.traverse().map(i => i.node).some(
                        n => n.parent?.data === c
                    )
                ).length,
                content: c
            }))
        )
        const dustCountList = (
            contents.map(c => ({
                count: c.dusts.length,
                content: c
            }))
        )

        const nc = neb.tree.insert(new TreeNode(new Content({ title: "소속 네뷸라 수" })));
        const pc = neb.tree.insert(new TreeNode(new Content({ title: "부모 수" })));
        const cc = neb.tree.insert(new TreeNode(new Content({ title: "자식 수" })));
        const dc = neb.tree.insert(new TreeNode(new Content({ title: "더스트 수" })));

        const ncNums = [...new Set(nebulaCountList.map(i => i.count))].sort()
        const pcNums = [...new Set(parentCountList.map(i => i.count))].sort()
        const ccNums = [...new Set(childCountList.map(i => i.count))].sort()
        const dcNums = [...new Set(dustCountList.map(i => i.count))].sort()

        for (const l of ncNums) {
            const countPicket = neb.tree.insert(new TreeNode(new Content({ title: l.toString() })), nc);
            for (const content of nebulaCountList.filter(i => i.count === l).map(i => i.content)) {
                neb.tree.insert(new TreeNode(content), countPicket)
            }
        }
        for (const l of pcNums) {
            const countPicket = neb.tree.insert(new TreeNode(new Content({ title: l.toString() })), pc);
            for (const content of parentCountList.filter(i => i.count === l).map(i => i.content)) {
                neb.tree.insert(new TreeNode(content), countPicket)
            }
        }
        for (const l of ccNums) {
            const countPicket = neb.tree.insert(new TreeNode(new Content({ title: l.toString() })), cc);
            for (const content of childCountList.filter(i => i.count === l).map(i => i.content)) {
                neb.tree.insert(new TreeNode(content), countPicket)
            }
        }
        for (const l of dcNums) {
            const countPicket = neb.tree.insert(new TreeNode(new Content({ title: l.toString() })), dc);
            for (const content of dustCountList.filter(i => i.count === l).map(i => i.content)) {
                neb.tree.insert(new TreeNode(content), countPicket)
            }
        }

        return neb;
    }
    private getMentionNebula() {
        const neb = new Nebula({ id: -4, name: "언급" })
        const contents = this.data.contents.all();

        for (const content of contents) {
            const texts = content.dusts.traverse().map(i => splitIntoPieces(i.node.data.claim).filter(ii => ii.kind === "text")).flat();

            const matchees = contents.filter(c => texts.some(t => t.text.includes(c.title)))
            if (matchees.length <= 0) continue;

            const node = neb.tree.insert(new TreeNode(content));
            for (const matchee of matchees) {
                neb.tree.insert(new TreeNode(matchee), node);
            }
        }

        return neb;
    }
}