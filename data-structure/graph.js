class Graph{
  nodes;
  edges;
  constructor(){
    this.nodes = [];
    this.edges = [];
  }
  addEdge(edge){
    this.edges.push(edge);
    edge.prev.edges.push(edge);
    edge.next.edges.push(edge);
  }
  removeEdge(index){
    this.edges.splice(index, 1);
    for(let node in this.nodes){
      let indexlocal = node.edges.indexOf(this.edges[index]);
      node.edges.splice(indexlocal,1);
    }
  }
}
class Node{
  data;
  edges;
  constructor(data){
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
class Edge{
  prev;
  next;
  weight;
  relation; /// 방법, 예시, if-then, 문제-해결
  constructor(prev, next, weight){
    this.prev = prev;
    this.next = next;
    this.weight = weight;
  }
}