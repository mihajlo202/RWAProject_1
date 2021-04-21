import { Observable } from "rxjs";
import {fromFetch} from 'rxjs/fetch'
import {switchMap} from 'rxjs/operators'
import { enviromentVariables } from "../constants/url-constants";
import { WorkType } from "../models/WorkType";

export class JobService {
    constructor() {}

    private workTypeUrl = enviromentVariables.URL_WORKTYPES;

    getAllWorkTypes():Observable<WorkType[]> {
        return fromFetch(this.workTypeUrl).pipe(
            switchMap(response =>  {
                if(response.ok)
                {
                    return response.json();
                }
            })
        )
    }
}