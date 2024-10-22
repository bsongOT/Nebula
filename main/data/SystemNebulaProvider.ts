import { Content, Nebula } from "./Data";
import context from "../context";
import { Tree, TreeNode } from "@/data-structure/tree";

export class SystemNebulaProvider {
  isolatedNebula(){
    const neb = new Nebula({id: -1, name: "isolated"})
    const loadedData = context.data.systemNebulas.isolated;
    for (const c of loadedData) neb.tree.insert(new TreeNode(neb.tree, c))

    return neb;
  }
  dayNebula(period:number){
    const neb = new Nebula({ id: -2, name: "day"});
    const allDay = [
      ...context.data.systemNebulas.day.add.map(d => d.day.getTime()),
      ...context.data.systemNebulas.day.modify.map(d => d.day.getTime()),
      ...context.data.systemNebulas.day.remove.map(d => d.day.getTime())
    ];
    if (allDay.length <= 0) return neb;

    const dd = 1000 * 60 * 60 * 24;
    const min = Math.min(...allDay);
    const max = Math.max(...allDay);
    const count = Math.ceil((max - min) / (dd * period));
    const loadedData = context.data.systemNebulas.day;

    for (let i = 0; i < count; i++){
      const from = min + i * period * dd;
      const to = min + (i + 1) * period * dd;
      const title = new Date(from).toISOString().substring(0, 10) + "~";
      
      const addedsList = loadedData.add.filter(i => from <= i.day.getTime() && i.day.getTime() < to);
      const modifiedsList = loadedData.modify.filter(i => from <= i.day.getTime() && i.day.getTime() < to);
      const removedsList = loadedData.remove.filter(i => from <= i.day.getTime() && i.day.getTime() < to);
      
      if (addedsList.length + modifiedsList.length + removedsList.length <= 0) continue;
      const node = neb.tree.insert(new TreeNode(neb.tree, new Content({title})));

      if (addedsList.length > 0){
        const add = neb.tree.insert(new TreeNode(neb.tree, new Content({title: "add"})), node);
        for (const d of addedsList) neb.tree.insert(new TreeNode(neb.tree, d.content), add)
      }
      if (modifiedsList.length > 0){
        const modify = neb.tree.insert(new TreeNode(neb.tree, new Content({title: "modify"})), node);
        for (const d of modifiedsList) neb.tree.insert(new TreeNode(neb.tree, d.content), modify)
      }
      if (removedsList.length > 0){
        const remove = neb.tree.insert(new TreeNode(neb.tree, new Content({title: "remove"})), node);
        for (const d of removedsList) neb.tree.insert(new TreeNode(neb.tree, d.content), remove)
      }
    }

    return neb;
  }
  importanceNebula(interval: number) {
    const neb = new Nebula({id: -3, name: "importance"});
    const loadedData = context.data.systemNebulas.importance;
  
    const nc = neb.tree.insert(new TreeNode(neb.tree, new Content({title: "Nebula Count"})));
    const pc = neb.tree.insert(new TreeNode(neb.tree, new Content({title: "Parent Count"})));
    const cc = neb.tree.insert(new TreeNode(neb.tree, new Content({title: "Child Count"})));
    const dc = neb.tree.insert(new TreeNode(neb.tree, new Content({title: "Dust Count"})));
        
    const ncNums = [...new Set(loadedData.nebula.map(i => i.count))].sort()
    const pcNums = [...new Set(loadedData.parent.map(i => i.count))].sort()
    const ccNums = [...new Set(loadedData.child.map(i => i.count))].sort()
    const dcNums = [...new Set(loadedData.dust.map(i => i.count))].sort()
  
    for (const l of ncNums){
      const countPicket = neb.tree.insert(new TreeNode(neb.tree, new Content({title: l.toString()})), nc);
      for (const content of loadedData.nebula.filter(i => i.count === l).map(i => i.content)){
        neb.tree.insert(new TreeNode(neb.tree, content), countPicket)
      }
    }
    for (const l of pcNums){
      const countPicket = neb.tree.insert(new TreeNode(neb.tree, new Content({title: l.toString()})), pc);
      for (const content of loadedData.parent.filter(i => i.count === l).map(i => i.content)){
        neb.tree.insert(new TreeNode(neb.tree, content), countPicket)
      }
    }
    for (const l of ccNums){
      const countPicket = neb.tree.insert(new TreeNode(neb.tree, new Content({title: l.toString()})), cc);
      for (const content of loadedData.child.filter(i => i.count === l).map(i => i.content)){
        neb.tree.insert(new TreeNode(neb.tree, content), countPicket)
      }
    }
    for (const l of dcNums){
      const countPicket = neb.tree.insert(new TreeNode(neb.tree, new Content({title: l.toString()})), dc);
      for (const content of loadedData.dust.filter(i => i.count === l).map(i => i.content)){
        neb.tree.insert(new TreeNode(neb.tree, content), countPicket)
      }
    }
    
    return neb;
  }
  lifetimeNebula() {
    const neb = new Nebula({id: -4, name: "lifetime"})
    const loadedData = context.data.systemNebulas.lifetime;
  
    const news = neb.tree.insert(new TreeNode(neb.tree, new Content({title: "New"})));
    const modifieds = neb.tree.insert(new TreeNode(neb.tree, new Content({title: "Modified"})));
    const livings = neb.tree.insert(new TreeNode(neb.tree, new Content({title: "Living"})));
    const deads = neb.tree.insert(new TreeNode(neb.tree, new Content({title: "Dead"})));
  
    loadedData.news.forEach(c => neb.tree.insert(new TreeNode(neb.tree, c), news))
    loadedData.modifieds.forEach(c => neb.tree.insert(new TreeNode(neb.tree, c), modifieds))
    loadedData.livings.forEach(c => neb.tree.insert(new TreeNode(neb.tree, c), livings))
    loadedData.deads.forEach(t => neb.tree.insert(new TreeNode(neb.tree, new Content({title: t})), deads))
  
    return neb;
  }
  mentionNebula(){
    const neb = new Nebula({id: -5, name: "mention"})
    const contents = context.data.contents.all();

    for (const content of contents){
      const matchees = contents.filter(c => c.dusts.nodes.map(d => d.data?.claim ?? "").join().includes(content.title));
      if (matchees.length <= 0) continue;

      const node = neb.tree.insert(new TreeNode(neb.tree, content));
      for (const matchee of matchees){
        neb.tree.insert(new TreeNode(neb.tree, matchee), node);
      }
    }

    return neb;
  }
}