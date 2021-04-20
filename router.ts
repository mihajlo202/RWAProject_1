import { MainPage } from "./src/pages/MainPage";

export class Router {
    constructor() {}

    navigateToMainPage(containter: HTMLDivElement) {
        var mainPage = new MainPage();
        mainPage.drawMainPage(document.getElementById("contentContainer") as HTMLDivElement);
    }
}