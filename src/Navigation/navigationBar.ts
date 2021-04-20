import { Router } from "../../router";


var _router = new Router();

export function createNavigation(parent: HTMLDivElement) {
    const menuC = document.createElement("div");
    menuC.className = "menuContainer";
    parent.appendChild(menuC);

    const imageItem = document.createElement("div");
    imageItem.className = "menuItem";
    menuC.appendChild(imageItem);

    const menuImage: HTMLImageElement = document.createElement("img");
    menuImage.src = "./resources/logo.png";
    menuImage.style.width = "75%";
    imageItem.appendChild(menuImage);

    const mainPageItem:HTMLDivElement = document.createElement("div");
    mainPageItem.innerHTML = "<p>Početna</p>"
    mainPageItem.className = "menuItem";
    mainPageItem.onclick=(ev)=>{
        parent.innerHTML = "";
        _router.navigateToMainPage(parent);
    }
    menuC.appendChild(mainPageItem);

    const firmItem:HTMLDivElement = document.createElement("div");
    firmItem.innerHTML = "<p>Firma</p>"
    firmItem.className = "menuItem";
    firmItem.onclick=(ev)=>{
       parent.innerHTML = "";
       _router.navigateToMainPage(parent); //change
    }
    menuC.appendChild(firmItem);

    const workerItem:HTMLDivElement = document.createElement("div");
    workerItem.innerHTML = "<p>Radnik</p>"
    workerItem.className = "menuItem";
    workerItem.onclick=(ev)=>{
        parent.innerHTML = "";
        _router.navigateToMainPage(parent); //change
    }
    menuC.appendChild(workerItem);
};
