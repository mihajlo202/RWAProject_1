import { from, Observable } from "rxjs";
import { enviromentVariables } from "../constants/url-constants"
import { Library } from "../models/Library";
 
export class LibraryService {
    url:string;
    constructor() {
        this.url = enviromentVariables.URL_DB;
    }

    getLibraries():Observable<Library[]> {
        return from(fetch(`${this.url}/libraries`)
        .then(res => res.json())
        .catch(err => console.log(err)));
    }

    async getLibraryByIdPromise(id:number):Promise<Response> {
        return new Promise((resolve, reject) => {
            const randomNumber = Math.random() * 10;
            setTimeout(() => resolve(fetch(`${this.url}/libraries/${id}`)), randomNumber);
        })
    }

    // getBookById(id:number) {
    //     return from(fetch(`${this.url}/books/` + id)
    //         .then(res => { return res.json() })
    //     )
    // }

    // getBookBySearchValue(text:string):Observable<Book[]> {
    //     return from(
    //         fetch(`${this.url}/books?title_like=${text}`)
    //             .then(res => { return res.json() })
    //     )
    // }

    // getBookByParametarsPromise(text:string, selectorValue:number):Promise<Response> {
    //     return new Promise((resolve, reject) => {
    //         const randomNumber = Math.random() * 10;
    //         setTimeout(() => resolve(fetch(`${this.url}/books?title_like=${text}&_limit=${selectorValue}`)), randomNumber);
    //     })
    // }

    // updateBookAvailability(book:Book) {
    //     const updateBook: Object ={
    //         method:"post",
    //         body: JSON.stringify(book),
    //         headers:{'Content-Type':'application/json'},
    //     };
    //     return from(fetch(`${this.url}/book/`,updateBook)
    //         .then((response) => response.json()))
    // }

    // async getBooksByPatronId(id) {
    //     return fetch(`${this.url}/books?user_id=${id}`)
    //     .then(res => res.json())
    //     .catch(err => console.log(err));
    // }
}