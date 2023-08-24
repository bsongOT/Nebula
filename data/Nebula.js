export class Nebula{
  name;
  id;
  kind; //type, flow
  origin;
  contentIds;
  directChildren;
  constructor(name, id, kind, first){
    this.name = name;
    this.id = id;
    this.kind = kind;
    this.origin = new NebulaNode(first)
    this.contentIds = [first.id];
    this.directChildren = [this.origin]
  }
  link(parent, child){
    if (!this.contentIds.includes(child.id)) this.contentIds.push(child.id);
    if (parent === this)
      return this.directChildren.push(child)
    if (!this.contentIds.includes(parent.id)) this.contentIds.push(parent.id);
    parent.children.push(child);
    child.parent = parent;
  }
}
export class NebulaNode {
  id;
  parent;
  children;
  constructor(content){
    this.id = content.id;
    this.children = [];
  }
}