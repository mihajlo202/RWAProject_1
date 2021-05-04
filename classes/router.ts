import { CatalogComponent } from "../components/catalog-component";
import { MainComponent } from "../components/main-component";

export class Router{
    constructor() {}

    navigateToMainPage() {
        const mainPage:MainComponent = new MainComponent();
        mainPage.drawMainView();
    }
    navigateToCatalogPage() {
        const catalog = new CatalogComponent();
        catalog.drawCatalog();
    }
    navigateToLibrariesPage() {

    }
    navigateToUsersPage() {

    }
}