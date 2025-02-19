import "./index.css"
import { body, btn, button, div } from "@/funcObject";
import { ContentEditor } from "./Pages/ContentPage/ContentPage";
import { NebulaPage } from "./Pages/NebulaPage/NebulaPage";
import { engine, U } from "@/engine";
import context from "./context";
import { TabWrapper } from "./Components/TabWrapper";
import { SearchPage } from "./Pages/SearchPage";
import { NoticePage } from "./Pages/NoticePage";
import { NoSelectionPage } from "./Pages/NoSelectionPage";
import { NotificationButton } from "./Components/PageOpeners/NotificationButton";
import { RelationPage } from "./Pages/RelationPage";
import { ClipboardButton } from "./Components/PageOpeners/ClipboardButton";
import { Carousel } from "./Components/SideMenus/Carousel";
import { SearchBar } from "./Components/SearchBar";
import { RandomButton } from "./Components/PageOpeners/RandomButton";
import { SettingButton } from "./Components/PageOpeners/SettingButton";
import { QueryButton } from "./Components/PageOpeners/QueryButton";
import { FilePage } from "./Pages/ContentPage/FilePage";
import { ClipboardPage } from "./Pages/ClipboardPage";
import { ChevronRight, createIcons, icons } from "lucide";
import { mentionContextMenu } from "./Components/MentionContextMenu";
import { SearchButton } from "./Components/PageOpeners/SearchButton";
import { GitButton } from "./Components/PageOpeners/GitButton";
import { GitPage } from "./Pages/GitPage";

document.addEventListener("click", () => {
  mentionContextMenu.remove();
})
document.addEventListener("keydown", e => {
  if ((e.ctrlKey || e.metaKey) && e.code === 'Slash'){
    context.screenSplit = !context.screenSplit;
    return;
  }
  else if ((e.ctrlKey || e.metaKey) && e.code === 'KeyT'){
    e.preventDefault();
    const newTab = {};
    context.selection = newTab;
    context.tabs.push(newTab);
    return;
  }
  else if ((e.ctrlKey || e.metaKey) && e.code === "KeyO"){
    context.searching = true;
  }
  else if(e.code === "Escape") {
    context.popupPage = "";
    context.searching = false;
    context.searchString = "";
    context.searchIndex = 0;
    if (document.activeElement instanceof HTMLInputElement){
      document.activeElement.blur()
    }
  }
})
document.addEventListener("click", e => {
  const elt = e.target as HTMLElement;
  context.isSideActive = document.querySelector(".left-side")?.contains(elt) ?? false;
})

context.selection.universe = context.data.systemUniverse;
context.selection.nebula = context.data.systemUniverse.dayNebula;
context.tabs.push(context.selection);

async function loadWorkspace(){
  const exists = await window.electron.workspaceExists();
  if (!exists) {
    alert("Workspace가 없습니다. 선택해주세요.");
    window.location.href = 'workspace-select.html';
  }
}

loadWorkspace()

body(
  div({ class: "tap-panel" })(
    TabWrapper(),
  ),
  div({ class: "side-button-container" })(
    SearchButton(),
    NotificationButton(),
    ClipboardButton(),
    QueryButton(),
    RandomButton(),
    GitButton(),
    SettingButton()
  ),
  div({ class: "left-side" })(
    Carousel()
  ),
  div({ class: 'main-view' })(
    (() => {
      const arr = new Array<HTMLElement>();
      const filePage = FilePage();
      const contentPage = ContentEditor();
      const nebulaPage = NebulaPage({get nebula(){return context.selection.nebula}});
      const relationPage = RelationPage();
      const noSelectionPage = NoSelectionPage();

      const secondContentPage = ContentEditor();

      engine.updater.register(() => {
        arr.splice(0, arr.length);
        if (context.screenSplit){
          arr.push(nebulaPage, contentPage);
          if (context.secondSelection){
            if (context.selection.content) arr[0] = contentPage;
            else if (context.selection.nebula) arr[0] = nebulaPage;
            else if (context.selection.relation) arr[0] = relationPage;
            else arr[0] = noSelectionPage;

            if (context.secondSelection.content) arr[1] = secondContentPage;
          }
          else {
            if (context.selection.content) {
              if (context.openedFile === ""){
                arr[0] = contentPage
              }
              else {
                arr[0] = contentPage;
                arr[1] = filePage;
              }
            }
          }
        }
        else {
          if (context.selection.content) return arr.push(contentPage);
          if (context.selection.nebula) return arr.push(nebulaPage);
          if (context.selection.relation) return arr.push(relationPage);
          return arr.push(noSelectionPage)
        }
      })
      return arr;
    })()
  ),
  SearchPage(),
  NoticePage(),
  ClipboardPage(),
  GitPage()
);