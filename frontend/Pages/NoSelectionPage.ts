import { Attribute, button, div } from "@/funcObject";

export function NoSelectionPage(){
    const buttonAttr:Attribute<'button'> = {
        className: "hover-color-999",
        inlineStyle: {
            border: "none",
            background: "none",
            marginTop: "15px",
            fontSize: "18px"
        }
    }
    const createUniverse = () => {

    }
    const createNebula = () => {

    }
    const createContent = () => {
        
    }
    return (
        div({ className: "page", inlineStyle: {display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center"} })(
            div({ inlineStyle: {fontSize: "30px", marginBottom: "10px"} })("선택된 페이지가 없습니다."),
            div({inlineStyle: {display: "flex", flexDirection: "column", alignItems: "center"}})(
                button({ onclick: createUniverse, ...buttonAttr })("새 유니버스 생성"),
                button({ onclick: createNebula, ...buttonAttr })("새 네뷸라 생성"),
                button({ onclick: createContent, ...buttonAttr })("새 컨텐츠 생성")
            )
        )
    )
}