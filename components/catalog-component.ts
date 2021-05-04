export class CatalogComponent {
    _contentContainer:HTMLDivElement;
    constructor() {
        this._contentContainer = document.getElementById("content-container") as HTMLDivElement;
    }

    drawCatalog() {
        this._contentContainer.innerHTML = "catalog"
    }
}