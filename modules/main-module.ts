import { MainComponent } from "../components/main-component";
import { NavBarComponent } from "../components/nav-bar-component";

export class MainModule{
    constructor() {

    }
    mainView() {
        const nav:NavBarComponent = new NavBarComponent();
        nav.drawNavBarView();
        const main:MainComponent = new MainComponent();
        main.drawMainView();
    }
}