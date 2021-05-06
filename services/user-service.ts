import { from, Observable } from "rxjs";
import { enviromentVariables } from "../constants/url-constants";
import { User } from "../models/User";

export class UserService {
    url:string;
    constructor() {
        this.url = enviromentVariables.URL_DB;
    }

    getUserByIdPromise(id:number):Promise<Response> {
        return new Promise((resolve, reject) => {
            const randomNumber = Math.random() * 10;
            setTimeout(() => resolve(fetch(`${this.url}/users/${id}`)), randomNumber);
        })
    }

    getUsersByLibrary(id:number):Promise<Response> {
        return new Promise((resolve, reject) => {
            const randomNumber = Math.random() * 10;
            setTimeout(() => resolve(fetch(`${this.url}/users/?library_id=${id}`)), randomNumber);
        })
    }

    getUserById(id:Number):Observable<User> {
        return from(
            fetch(`${this.url}/users?id=${id}`)
                .then(res => { return res.json() })
        )
    }

    getAllUsers():Observable<User[]> {
        return from(
            fetch(`${this.url}/users/`)
                .then(res => { return res.json() })
        )
    }

    getUsersBySearchValue(text:string):Observable<User[]> {
        return from(
            fetch(`${this.url}/users?last_name_like=${text}`)
                .then(res => { return res.json() })
        )
    }
}