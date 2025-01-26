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

    constructor(private data: Data) {
        super({ name: "시스템" });
        
        this.dayNebula = this.getDayNebula(1);
        this.isolatedNebula = this.getIsolatedNebula();
        this.importanceNebula = this.getImportanceNebula();
        this.mentionNebula = this.getMentionNebula();

        this.nebulaLocations.push({
            nebula: this.dayNebula,
            start: H(14, 0, 0)
            }, {
            nebula: this.isolatedNebula,
            start: H(12, 0, 2)
            }, {
            nebula: this.importanceNebula,
            start: H(11, 0, 3)
            }, {
            nebula: this.mentionNebula,
            start: H(9, 0, 5)
        })
    }
    private getIsolatedNebula() {
        const neb = new Nebula({ id: -1, name: "고립" })
        const loadedData = this.data.systemNebulas.isolated;
        for (const c of loadedData) neb.tree.insert(new TreeNode(c))

        return neb;
    }
    private getDayNebula(period: number) {
        const neb = new Nebula({ id: -2, name: "일지" });
        const allDay = [
            ...this.data.systemNebulas.day.add.map(d => d.day.getTime()),
            ...this.data.systemNebulas.day.modify.map(d => d.day.getTime()),
            ...this.data.systemNebulas.day.remove.map(d => d.day.getTime())
        ];
        if (allDay.length <= 0) return neb;

        const dd = 1000 * 60 * 60 * 24;
        const min = Math.min(...allDay);
        const max = Math.max(...allDay);
        const count = Math.ceil((max - min) / (dd * period)) + 1;
        const loadedData = this.data.systemNebulas.day;

        const minDay = new Date(min);

        let yearNode = neb.tree.insert(new TreeNode(new Content({ title: minDay.getFullYear() + "년" })))
        let monthNode = neb.tree.insert(new TreeNode(new Content({ title: minDay.getMonth() + 1 + "월" })), yearNode);

        for (let i = 0; i < count; i++) {
            const from = min + i * period * dd;
            const to = min + (i + 1) * period * dd;
            const day = new Date(from);
            const title = day.getDate() + "일";

            const addedsList = loadedData.add.filter(i => from <= i.day.getTime() && i.day.getTime() < to);
            const modifiedsList = loadedData.modify.filter(i => from <= i.day.getTime() && i.day.getTime() < to);
            const removedsList = loadedData.remove.filter(i => from <= i.day.getTime() && i.day.getTime() < to);

            if (addedsList.length + modifiedsList.length + removedsList.length <= 0) continue;
            if (yearNode.data.title !== day.getFullYear() + "년") {
                yearNode = neb.tree.insert(new TreeNode(new Content({ title: day.getFullYear() + "년" })))
            }
            if (monthNode.data.title !== day.getMonth() + 1 + "월") {
                monthNode = neb.tree.insert(new TreeNode(new Content({ title: day.getMonth() + 1 + "월" })), yearNode);
            }

            const node = neb.tree.insert(new TreeNode(new Content({ title })), monthNode);

            if (addedsList.length > 0) {
                const add = neb.tree.insert(new TreeNode(new Content({ title: "추가" })), node);
                for (const d of addedsList) neb.tree.insert(new TreeNode(d.content), add)
            }
            if (modifiedsList.length > 0) {
                const modify = neb.tree.insert(new TreeNode(new Content({ title: "수정" })), node);
                for (const d of modifiedsList) neb.tree.insert(new TreeNode(d.content), modify)
            }
            if (removedsList.length > 0) {
                const remove = neb.tree.insert(new TreeNode(new Content({ title: "삭제" })), node);
                for (const d of removedsList) neb.tree.insert(new TreeNode(d.content), remove)
            }
        }

        return neb;
    }
    private getImportanceNebula() {
        const neb = new Nebula({ id: -3, name: "중요도" });
        const loadedData = this.data.systemNebulas.importance;

        const nc = neb.tree.insert(new TreeNode(new Content({ title: "소속 네뷸라 수" })));
        const pc = neb.tree.insert(new TreeNode(new Content({ title: "부모 수" })));
        const cc = neb.tree.insert(new TreeNode(new Content({ title: "자식 수" })));
        const dc = neb.tree.insert(new TreeNode(new Content({ title: "더스트 수" })));

        const ncNums = [...new Set(loadedData.nebula.map(i => i.count))].sort()
        const pcNums = [...new Set(loadedData.parent.map(i => i.count))].sort()
        const ccNums = [...new Set(loadedData.child.map(i => i.count))].sort()
        const dcNums = [...new Set(loadedData.dust.map(i => i.count))].sort()

        for (const l of ncNums) {
            const countPicket = neb.tree.insert(new TreeNode(new Content({ title: l.toString() })), nc);
            for (const content of loadedData.nebula.filter(i => i.count === l).map(i => i.content)) {
                neb.tree.insert(new TreeNode(content), countPicket)
            }
        }
        for (const l of pcNums) {
            const countPicket = neb.tree.insert(new TreeNode(new Content({ title: l.toString() })), pc);
            for (const content of loadedData.parent.filter(i => i.count === l).map(i => i.content)) {
                neb.tree.insert(new TreeNode(content), countPicket)
            }
        }
        for (const l of ccNums) {
            const countPicket = neb.tree.insert(new TreeNode(new Content({ title: l.toString() })), cc);
            for (const content of loadedData.child.filter(i => i.count === l).map(i => i.content)) {
                neb.tree.insert(new TreeNode(content), countPicket)
            }
        }
        for (const l of dcNums) {
            const countPicket = neb.tree.insert(new TreeNode(new Content({ title: l.toString() })), dc);
            for (const content of loadedData.dust.filter(i => i.count === l).map(i => i.content)) {
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