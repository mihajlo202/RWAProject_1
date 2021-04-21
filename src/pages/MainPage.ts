import { from } from "rxjs";
import { take } from "rxjs/operators";
import { WorkType } from "../../models/WorkType";
import { Router } from "../../router";
import { JobService } from "../../services/job-service";

export class MainPage {
    _router: Router;
    jobService: JobService;
    //workers: WorkServices;
    //TaskItem: TaskItem;
    mainContainer: HTMLDivElement;
    rightMenuContent: HTMLDivElement;
    //modal: HTMLDivElement;
    //arrayOfTypes: Array<Object>

    constructor() {
        this._router = new Router();
        this.jobService = new JobService();
        this.mainContainer = null
    }

    drawMainPage(parent: HTMLDivElement) {
        const container:HTMLDivElement = document.createElement("div");
        parent.appendChild(container);
        this.mainContainer = container;
        this.mainContainer.className = "mainContainer";

        //this.handleCreateModal(parent);

        const rightContentContainer:HTMLDivElement = document.createElement("div")
        rightContentContainer.className = "rightMenuContent";
        this.mainContainer.appendChild(rightContentContainer);
        this.rightMenuContent = rightContentContainer;

        this.jobService.getAllWorkTypes().subscribe(
            (workTypes:WorkType[]) => this.drawLeftContainer(workTypes)
        )
       
        //this.drawTasks(null)
    }

     drawLeftContainer(workTypes:Array<WorkType>) {
    
        const leftContainer:HTMLDivElement = document.createElement("div");
        leftContainer.className = "leftMenuContent";
        this.mainContainer.appendChild(leftContainer);

        let leftContainerTitle:HTMLDivElement = document.createElement("div");
        leftContainerTitle.className = "leftMenuContentTitle"
        leftContainerTitle.innerText = "Tip posla",

        leftContainer.appendChild(leftContainerTitle);

        from(workTypes).pipe(
            take(7)
        ).subscribe(
            (workType:WorkType) => this.drawWorkTypeItems(workType,leftContainer)
        );
     }

    drawWorkTypeItems(workType:WorkType,parent:HTMLDivElement) {
        const workTypeContainer :HTMLDivElement = document.createElement("div");
        workTypeContainer.className = "leftMenuContentItem"
        workTypeContainer.innerText = workType.name
        // workTypeContainer.onclick =()=>{
        //     this.rightMenuContent.innerHTML = "";
        //     this.tasks.getAllTaskById(workType.id).subscribe(
        //             tasks => this.drawTaskItems(tasks, this.rightMenuContent) 
        //             )   
    //      }
        parent.appendChild(workTypeContainer)
    }
}