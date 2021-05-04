import { Router } from "../classes/router"

export class NavBarComponent{
    _router: Router;
    _navBar: HTMLDivElement;
    constructor() {
        this._router = new Router();
        this._navBar = document.getElementById("nav-bar-container") as HTMLDivElement;
    }

    drawNavBarView() {
        const navBar:HTMLDivElement = document.createElement("div");
        navBar.className = "nav-bar";
        this._navBar.appendChild(navBar);

        const logoItem: HTMLDivElement = document.createElement("div");
        logoItem.className = "nav-item";
        navBar.appendChild(logoItem);

        const logoItemImage:HTMLImageElement = document.createElement("img");
        logoItemImage.src = "./resources/logo.png";
        logoItemImage.className = "nav-item-logo";
        logoItem.appendChild(logoItemImage);

        const homeItem:HTMLDivElement = document.createElement("div");
        homeItem.className = "nav-item";
        homeItem.innerHTML = "<p>Početna</p>";
        homeItem.onclick = (ev) => {
            this._router.navigateToMainPage();
        }
        navBar.appendChild(homeItem);

        const catalogItem:HTMLDivElement = document.createElement("div");
        catalogItem.className = "nav-item";
        catalogItem.innerHTML = "<p>Katalog</p>";
        catalogItem.onclick = (ev) => {
            this._router.navigateToCatalogPage();
        }
        navBar.appendChild(catalogItem);

        const librariesItem:HTMLDivElement = document.createElement("div");
        librariesItem.className = "nav-item";
        librariesItem.innerHTML = "<p>Biblioteke</p>";
        librariesItem.onclick = (ev) => {
            this._router.navigateToLibrariesPage();
        }
        navBar.appendChild(librariesItem);

        const usersItem:HTMLDivElement = document.createElement("div");
        usersItem.className = "nav-item";
        usersItem.innerHTML = "<p>Korisnici</p>";
        usersItem.onclick = (ev) => {
            this._router.navigateToLibrariesPage();
        }
        navBar.appendChild(usersItem);
    }
}