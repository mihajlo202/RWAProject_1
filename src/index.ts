import { Router } from "../router";
import { createNavigation } from "./Navigation/navigationBar";

 let navigationBar = document.getElementById("navigationContainer");
 createNavigation(navigationBar as HTMLDivElement)

var contentContainer = document.getElementById("contentContainer")
var router = new Router();

 router.navigateToMainPage(contentContainer as HTMLDivElement);