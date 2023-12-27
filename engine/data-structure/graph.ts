export class Graph<T>{
  nodes:Node<T>[];
  edges:Edge<T>[];
  constructor(){
    this.nodes = [];
    this.edges = [];
  }
  public addEdge(edge:Edge<T>):void{
    this.edges.push(edge);
    edge.prev.edges.push(edge);
    edge.next.edges.push(edge);
  }
  public removeEdge(index:number){
    this.edges.splice(index, 1);
    for(let n of this.nodes){
      let indexlocal = n.edges.indexOf(this.edges[index]);
      n.edges.splice(indexlocal,1);
    }
  }
}
export class Node<T>{
  data:T;
  edges:Edge<T>[];
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
export class Edge<T>{
  prev:Node<T>;
  next:Node<T>;
  weight:number;
  relation:string;
  constructor(prev:Node<T>, next:Node<T>, weight:number, relation:string){
    this.prev = prev;
    this.next = next;
    this.weight = weight;
    this.relation = relation;
  }
}