import { div, span, inputText } from "@/funcObject";
import { Content } from "../../backend/data/Data";
import context from "../context";

export function SearchBar(){
    function handleKey(e:KeyboardEvent){
      const text = e.target as HTMLInputElement;
      if (e.code === 'Enter'){
        if (text.value.trim() === "") return;
        context.data.addContent(new Content({title: text.value}));
        text.value = '';
        context.searchString = '';
      }
    }
    function handleInput(e:Event){
      context.searchString = (e.target as HTMLInputElement).value;
    }
    return (
      div({ class: "search-bar" })(
        span({ class: "material-symbols-outlined" })("search"),
        inputText({
          onfocus: () => context.searching = true,
          onkeyup: handleKey,
          oninput: handleInput,
          placeholder: "검색 또는 컨텐츠 추가",
          inlineStyle: {flexGrow: "1"}
        })()
      )
    )
  }