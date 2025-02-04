import "./index.css"
import { body, btn, button, div } from "@/funcObject";
import { ContentEditor } from "./Pages/ContentPage/ContentPage";
import { NebulaPage } from "./Pages/NebulaPage/NebulaPage";
import { engine, U } from "@/engine";
import context from "./context";
import { TabWrapper } from "./Components/TabWrapper";
import { SearchPage } from "./Pages/SearchPage";
import { NoticePage } from "./Pages/NoticePage";
import { UniversePage } from "./Pages/UniversePage";
import { NoSelectionPage } from "./Pages/NoSelectionPage";
import { NotificationButton } from "./Components/PageOpeners/NotificationButton";
import { RelationPage } from "./Pages/RelationPage";
import { ClipboardButton } from "./Components/PageOpeners/ClipboardButton";
import { Carousel } from "./Components/SideMenus/Carousel";
import { Breadcrumb } from "./Components/SideMenus/Breadcrumb";
import { NebulaPageNavigator } from "./Pages/NebulaPage/NebulaPageNavigator";
import { SearchBar } from "./Components/SearchBar";
import { RandomButton } from "./Components/PageOpeners/RandomButton";
import { SettingButton } from "./Components/PageOpeners/SettingButton";
import { QueryButton } from "./Components/PageOpeners/QueryButton";
import { FilePage } from "./Pages/ContentPage/FilePage";
import { ClipboardPage } from "./Pages/ClipboardPage";

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
  div({ class: "top-menu" })(
    SearchBar()
  ),
  div({ class: "top-fixed-menu" })(
    RandomButton(),
    QueryButton(),
    ClipboardButton(),
    NotificationButton(),
    SettingButton()
  ),
  div({ class: "tap-panel" })(
    TabWrapper(),
  ),
  div({ class: "left-side" })(
    Breadcrumb(),
    Carousel()
  ),
  div({ class: 'main-view' })(
    (() => {
      const arr = new Array<HTMLElement>();
      const nebulaPageNavigator = NebulaPageNavigator();
      const filePage = FilePage();
      const contentPage = ContentEditor();
      const nebulaPage = NebulaPage({get nebula(){return context.selection.nebula}});
      const relationPage = RelationPage();
      const universePage = UniversePage();
      const noSelectionPage = NoSelectionPage();

      const secondContentPage = ContentEditor();
      const secondNebulaPage = NebulaPage({get nebula(){return context.secondSelection?.nebula ?? context.selection?.nebula}, pageAddition: 1})
      const secondRelationPage = RelationPage();
      const secondUniversePage = UniversePage();
      const secondNoSelectionPage = div({class: "page"})();

      engine.updater.register(() => {
        arr.splice(0, arr.length);
        if (context.selection.nebula) arr.push(nebulaPageNavigator);
        if (context.screenSplit){
          arr.push(noSelectionPage, universePage);
          if (context.secondSelection){
            if (context.selection.content) arr[1] = contentPage;
            else if (context.selection.nebula) arr[1] = nebulaPage;
            else if (context.selection.relation) arr[1] = relationPage;
            else if (context.selection.universe) arr[1] = universePage;
            else arr[1] = noSelectionPage;

            if (context.secondSelection.content) arr[2] = secondContentPage;
            else if (context.secondSelection.nebula) arr[2] = secondNebulaPage;
            else if (context.secondSelection.relation) arr[2] = secondRelationPage;
            else if (context.secondSelection.universe) arr[2] = secondUniversePage;
            else arr[2] = secondNoSelectionPage;
          }
          else {
            if (context.selection.content) {
              if (context.openedFile === ""){
                arr[1] = nebulaPage;
                arr[2] = contentPage;
              }
              else {
                arr[1] = contentPage;
                arr[2] = filePage;
              }
            }
            else if (context.selection.nebula) {
              arr[1] = relationPage;
              arr[2] = nebulaPage;
            }
            else if (context.selection.relation) {
              arr[1] = universePage;
              arr[2] = relationPage;
            }
            else if (context.selection.universe) {
              arr[1] = noSelectionPage;
              arr[2] = universePage;
            }
            else {
              arr[1] = secondNoSelectionPage;
              arr[2] = noSelectionPage;
            }
          }
        }
        else {
          if (context.selection.content) return arr.push(contentPage);
          if (context.selection.nebula) return arr.push(nebulaPage);
          if (context.selection.relation) return arr.push(relationPage);
          if (context.selection.universe) return arr.push(universePage);
          return arr.push(noSelectionPage)
        }
      })
      return arr;
    })()
  ),
  SearchPage(),
  NoticePage(),
  ClipboardPage()
);