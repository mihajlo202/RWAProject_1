import { CatalogComponent } from "../components/catalog-component";
import { LibrariesComponent } from "../components/libraries-component";
import { MainComponent } from "../components/main-component";
import { UsersComponent } from "../components/users-component";

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
        const libraries = new LibrariesComponent();
        libraries.drawLibraries();
    }
    navigateToUsersPage() {
        const usersPage = new UsersComponent();
        usersPage.drawUsers();
    }
}