import { from, Observable } from "rxjs";
import { enviromentVariables } from "../constants/url-constants"
import { Book } from "../models/Book";
 
export class BookService {
    url:string;
    constructor() {
        this.url = enviromentVariables.URL_DB;
    }

    getBooks():Observable<Book[]> {
        return from(fetch(`${this.url}/books`)
        .then(res => res.json())
        .catch(err => console.log(err)));
    }

    getBooksPromise():Promise<Response> {
        return new Promise((resolve, reject) => {
            const randomNumber = Math.random() * 10;
            setTimeout(() => resolve(fetch(`${this.url}/books/`)), randomNumber);
        })
    }

    getBookById(id:number) {
        return from(fetch(`${this.url}/books/` + id)
            .then(res => { return res.json() })
        )
    }

    getBookBySearchValue(text:string):Observable<Book[]> {
        return from(
            fetch(`${this.url}/books?title_like=${text}`)
                .then(res => { return res.json() })
        )
    }

    async getBookByParametarsPromise(text:string, selectorValue:number):Promise<Response> {
        return new Promise((resolve, reject) => {
            if(selectorValue != -1)
                resolve(fetch(`${this.url}/books?title_like=${text}&_limit=${selectorValue}`));
            else
                resolve(fetch(`${this.url}/books?title_like=${text}`));
        })
    }

    updateBookAvailability(book:Book) {
        const updateBook: Object ={
            method:"put",
            body: JSON.stringify(book),
            headers:{'Content-Type':'application/json'},
        };
        return fetch(`${this.url}/books/${book.id}`,updateBook)
    }

    getBooksByUserId(id:number):Observable<Book[]> {
        return from(
            fetch(`${this.url}/books?user_id=${id}`)
                .then(res => { return res.json() })
        )
    }

    async getBooksByPatronId(id) {
        return fetch(`${this.url}/books?user_id=${id}`)
        .then(res => res.json())
        .catch(err => console.log(err));
    }
}