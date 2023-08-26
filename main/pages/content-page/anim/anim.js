//
class Char{
  name;
  face;
  ability;
  from;
  get html(){
    return `
    <li>
    </li>
    `.trim();
  }
}
class Scene{
  place;
  chars;
  desc;
}
const animType = [
  "미완결 & 보는중",
  "완결 & 보는중",
  "완결 & 다봄"
]

const data = {
  title: "나의 히어로 아카데미아",
  status: "3기 보는 중",
  chars: [
    {
      name: ["미도리야"],
      face: ["^;^"],
      ability: ["원포올"],
      from: ["1학년 A반"]
    }
  ],
  seasons: [
    {
      title: "1기",
      series: [
        "1화", "2화", "3화"
      ]
    }
  ],
  places: [
  ]
};
//

class Season{
  constructor(){
    
  }
}

const app = new pixy.Application({
  width:200,
  height:200
});
document.body.appendChild(app.view);