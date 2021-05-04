import { Router } from "../classes/router";

export class MainComponent {
    _router: Router;
    _contentContainer: HTMLDivElement;
    constructor() {
        this._router = new Router();
        this._contentContainer = document.getElementById("content-container") as HTMLDivElement;
        this._contentContainer.innerHTML = "";
    }
    drawMainView() {
        const contentContainer: HTMLDivElement = document.createElement("div")
        contentContainer.className = "main-content-container";
        this._contentContainer.appendChild(contentContainer);

        const catalogItemContainer: HTMLDivElement = document.createElement("div");
        catalogItemContainer.className = "main-item-container";
        const catalogItem:HTMLDivElement = document.createElement("div");
        catalogItem.className = "main-item";
        const catalogItemImage:HTMLImageElement = document.createElement("img");
        catalogItemImage.src = "../resources/books.jpg";
        catalogItemImage.className = "main-item-image"
        catalogItem.appendChild(catalogItemImage);
        const catalogItemDescription:HTMLDivElement = document.createElement("div");
        catalogItemDescription.innerHTML = "<p>Pogledajte sve knjige koje se nalaze u bibliotekama.</p>"
        catalogItemDescription.className = "main-item-description";
        catalogItem.appendChild(catalogItemDescription);
        catalogItemContainer.appendChild(catalogItem);
        catalogItemContainer.onclick = () => {
            this._router.navigateToCatalogPage();
        }
        contentContainer.appendChild(catalogItemContainer);

        const librariesItemContainer: HTMLDivElement = document.createElement("div");
        librariesItemContainer.className = "main-item-container";
        const librariesItem:HTMLDivElement = document.createElement("div");
        librariesItem.className = "main-item";
        const librariesItemImage:HTMLImageElement = document.createElement("img");
        librariesItemImage.src = "../resources/libraries.jpg";
        librariesItemImage.className = "main-item-image"
        librariesItem.appendChild(librariesItemImage);
        const librariesItemDescription:HTMLDivElement = document.createElement("div");
        librariesItemDescription.innerHTML = "<p>Pogledajte sve biblioteke koje se nalaze u Nišu.</p>"
        librariesItemDescription.className = "main-item-description";
        librariesItem.appendChild(librariesItemDescription);
        librariesItemContainer.appendChild(librariesItem);
        librariesItemContainer.onclick = () => {
            this._router.navigateToLibrariesPage();
        }
        librariesItemContainer.appendChild(librariesItem);
        contentContainer.appendChild(librariesItemContainer);

        const usersItemContainer: HTMLDivElement = document.createElement("div");
        usersItemContainer.className = "main-item-container";
        const usersItem:HTMLDivElement = document.createElement("div");
        usersItem.className = "main-item";
        const usersItemImage:HTMLImageElement = document.createElement("img");
        usersItemImage.src = "../resources/users.jpg";
        usersItemImage.className = "main-item-image"
        usersItem.appendChild(usersItemImage);
        const usersItemDescription:HTMLDivElement = document.createElement("div");
        usersItemDescription.innerHTML = "<p>Pogledajte sve korisnike usluga.</p>"
        usersItemDescription.className = "main-item-description";
        usersItem.appendChild(usersItemDescription);
        usersItemContainer.appendChild(usersItem);
        usersItemContainer.onclick = () => {
            this._router.navigateToUsersPage();
        }
        usersItemContainer.appendChild(usersItem);
        contentContainer.appendChild(usersItemContainer);
    }
}