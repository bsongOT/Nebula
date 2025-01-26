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

document.addEventListener("keydown", e => {
  if ((e.ctrlKey || e.metaKey) && e.code === 'Slash'){
    context.screenSplit = !context.screenSplit;
    return;
  }
  if ((e.ctrlKey || e.metaKey) && e.code === 'KeyT'){
    e.preventDefault();
    e.stopImmediatePropagation();
    const newTab = {};
    context.selection = newTab;
    context.tabs.push(newTab);
    return;
  }
})
document.addEventListener("click", e => {
  const elt = e.target as HTMLElement;
  if (![...document.querySelectorAll(".search-bar, .search-page")].some(p => p.contains(elt))){
    context.searching = false;
  }
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
  div({ className: U(() => `left-side ${context.searching ? "hidden" : ""}`.trim()) })(
    Breadcrumb(),
    Carousel()
  ),
  div({className: U(() => `main-view ${context.searching ? "hidden" : ""}`.trim())})(
    (() => {
      const arr = new Array<HTMLElement>();
      const nebulaPageNavigator = NebulaPageNavigator();
      const filePage = FilePage();
      const contentPage = ContentEditor();
      const nebulaPage = NebulaPage({get nebula(){return context.selection.nebula}});
      const relationPage = RelationPage();
      const universePage = UniversePage();
      const noSelectionPage = NoSelectionPage();

      const secondNebulaPage = NebulaPage({get nebula(){return context.secondSelection?.nebula ?? context.selection?.nebula}, pageAddition: 1})

      engine.updater.register(() => {
        arr.splice(0, arr.length);
        if (context.selection.nebula) arr.push(nebulaPageNavigator);
        if (context.screenSplit){
          arr.push(noSelectionPage)
          if (context.selection.universe) arr.push(universePage);
          if (context.selection.relation) arr.push(relationPage);
          if (context.selection.nebula) arr.push(nebulaPage);
          if (context.selection.content) arr.push(contentPage);
          if (context.openedFile !== "") arr.push(filePage);
          if (!context.secondSelection) arr.splice(1, arr.length - 3)
          else {
            arr.splice(1, arr.length - 2)
            arr.push(secondNebulaPage)
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
  NoticePage()
);