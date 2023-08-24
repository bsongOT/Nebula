export function emptyArr(size){
  return Array(size).fill();
}
export function tour(node, depth, privateIndex, func){
  func(node, depth, privateIndex);
  for (let n of node.children)
    tour(n, depth + 1, privateIndex++, func)
  privateIndex = 0;
}
export function getLast(node){
  if (!node?.children) return node;
  if (node.children.length <= 0) return node;
  return getLast(node.children[node.children.length - 1])
}
export function hangulSeperate(str){
  const chars = str.split("")
  const chos = [
    "ㄱ", "ㄲ", "ㄴ", "ㄷ", "ㄸ",
    "ㄹ", "ㅁ", "ㅂ", "ㅃ", "ㅅ",
    "ㅆ", "ㅇ", "ㅈ", "ㅉ", "ㅊ", 
    "ㅋ", "ㅌ", "ㅍ", "ㅎ"
  ];
  const jungs = [
    "ㅏ", "ㅐ", "ㅑ", "ㅒ", "ㅓ", "ㅔ", 
    "ㅕ", "ㅖ", "ㅗ", "ㅗㅏ", "ㅗㅐ", "ㅗㅣ",
    "ㅛ", "ㅜ", "ㅜㅓ", "ㅜㅔ", "ㅜㅣ", "ㅠ", 
    "ㅡ", "ㅡㅣ", "ㅣ"
  ];
  const jongs = [
    "", "ㄱ", "ㄲ", "ㄱㅅ", "ㄴ", "ㄴㅈ",
    "ㄴㅎ", "ㄷ", "ㄹ", "ㄹㄱ", "ㄹㅁ", "ㄹㅂ", 
    "ㄹㅅ", "ㄹㅌ", "ㄹㅍ", "ㄹㅎ", "ㅁ", "ㅂ", 
    "ㅂㅅ", "ㅅ", "ㅆ", "ㅇ", "ㅈ", "ㅊ", 
    "ㅋ", "ㅌ", "ㅍ", "ㅎ"
  ]
  return chars.map(c => {
    if (c < '가' || c > '힣') return c;
    
    const u = c.charCodeAt(0) - 44032;
    const jong = u % 28;
    const jung = ((u - jong) / 28) % 21;
    const cho = (((u - jong) / 28) - jung) / 21;
    
    return chos[cho] + jungs[jung] + jongs[jong]
  }).join("")
}