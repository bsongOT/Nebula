export class Graph{
  nodes:Node[];
  edges:Edge[];
  constructor(){
    this.nodes = [];
    this.edges = [];
  }
  addEdge(edge:Edge):void{
    this.edges.push(edge);
    edge.prev.edges.push(edge);
    edge.next.edges.push(edge);
  }
  removeEdge(index:number){
    this.edges.splice(index, 1);
    for(let n of this.nodes){
      let indexlocal = n.edges.indexOf(this.edges[index]);
      n.edges.splice(indexlocal,1);
    }
  }
}
export class Node{
  data:any;
  edges:Edge[];
  constructor(data:any){
    this.data = data;
    this.edges = [];
  }
  linkedNodes(){
    return this.edges
          .map(e => [e.prev, e.next])
          .flat()
          .filter(n => n !== this)
  }
}
export class Edge{
  prev:Node;
  next:Node;
  weight:number;
  relation:string;
  constructor(prev:Node, next:Node, weight:number){
    this.prev = prev;
    this.next = next;
    this.weight = weight;
  }
}