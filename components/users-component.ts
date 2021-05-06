import { BookService } from "../services/book-service";
import { selectorValues } from "../constants/selectors-constants"
import { Book } from "../models/Book";
import { take, mergeMap, debounceTime, map, switchMap, takeUntil, timeInterval } from "rxjs/operators";
import { LibraryService } from "../services/library-service";
import { UserService } from "../services/user-service";
import { fromEvent, Observable, zip } from "rxjs";
import { User } from "../models/User";
import { Library } from "../models/Library";

export class UsersComponent {
    _contentContainer:HTMLDivElement;
    _bookService:BookService;
    _libraryService:LibraryService
    _usersService:UserService;
    _searchInput: string;
    modal:HTMLDivElement;
    constructor() {
        this._contentContainer = document.getElementById("content-container") as HTMLDivElement;
        this._bookService = new BookService();
        this._libraryService = new LibraryService();
        this._usersService = new UserService();
        this.modal = null;
    }

    drawUsers() {
        this._contentContainer.innerHTML = "";

        const catalogContainer:HTMLDivElement = document.createElement("div");
        catalogContainer.className = "users-page-container";
        this._contentContainer.appendChild(catalogContainer);

        const catalogHeader:HTMLDivElement = document.createElement("div");
        catalogHeader.className = "users-page-header";
        catalogHeader.innerHTML = "<p>Korisnici</p>";
        catalogContainer.appendChild(catalogHeader);
        
        catalogContainer.appendChild(this.getCatalogSearch());

        const tableContainer:HTMLDivElement = document.createElement("div");
        tableContainer.className = "table-container";
        catalogContainer.appendChild(tableContainer); 

        const tableCatalog:HTMLTableElement = document.createElement("table");
        tableCatalog.id = "book-catalog"
        tableContainer.appendChild(tableCatalog); 

        this.drawTable(tableCatalog);

        this.createSearchInputEvent();

        this.handleCreateModal();
    }

    getCatalogSearch():HTMLDivElement {
        const searchOptions:HTMLDivElement = document.createElement("div");
        searchOptions.className = "search-options";

        const searchInput:HTMLInputElement = document.createElement("input");
        searchInput.id = "search-input-id";
        searchInput.className = 'search-options-input';
        searchInput.type = "text";
        searchInput.placeholder = "Unesite text za pretragu...";
        searchOptions.append(searchInput);
        return searchOptions;
    }

    createSearchInputEvent() {
        const searchInput = document.getElementById("search-input-id");
        fromEvent(searchInput, "input").pipe(
            debounceTime(500),
            map(ev => (ev.target as HTMLInputElement).value),
            switchMap(text => this._usersService.getUsersBySearchValue(text))
        )
            .subscribe(userList => this.drawUserListInTable(userList));
    }

    drawUserListInTable(userList: Array<User>) {
        let table = document.getElementById("book-catalog") as HTMLTableElement;
        table.innerHTML = "";
        table.appendChild(this.getTableHeader());
        const length:number = userList.length;
        let i:number =0;
        const button:HTMLButtonElement = document.createElement("button");
        const timer$ = new Observable(sub=>{
                let intervalID = setInterval(()=>{
                    sub.next(userList[i++])
                },300)
                return()=>{
                    clearInterval(intervalID)
                } 
        })
        const cancelTimer$ = fromEvent(button,'click');

        timer$.pipe(
            takeUntil(cancelTimer$)
        ).subscribe(
            (user:User) => i!==length+1?this.drawUserInTable(user,table):button.click() 
        )
    }

    drawTable(table:HTMLTableElement) {
        table.innerHTML = ""
        table.appendChild(this.getTableHeader());
        this._usersService.getAllUsers()
        .subscribe(userList => this.drawUserListInTable(userList))
        
    }

    drawUserInTable(user:User, table:HTMLTableElement) {
        const row = this._libraryService.getLibraryByIdPromise(user.library_id)
        .then(res => { return res.json() })
        .then((library:Library) => {
            const userRow:HTMLTableRowElement = document.createElement("tr");
            userRow.innerHTML = `<td>${user.first_name}</td>
                                <td>${user.last_name}</td>
                                <td>${user.member_since}</td>
                                <td>${library.name}</td>`;
            userRow.onclick = () => {
                this.getUserInformationWithAllBooks(user.id);
            }
            table.appendChild(userRow);
        })
        
    }

    getTableHeader():HTMLTableSectionElement {
        const tableHeader:HTMLTableSectionElement = document.createElement("thead");
        tableHeader.innerHTML = `<tr>
                                    <th>Ime</th>
                                    <th>Prezime</th>
                                    <th>Datum registrovanja</th>
                                    <th>Biblioteka</th>
                                </tr>`;
        return tableHeader;
    }

    handleCreateModal(){
        let modelContainer: HTMLDivElement = document.createElement("div");
        modelContainer.className = "modal"
        this.modal = modelContainer;
        this._contentContainer.appendChild(modelContainer)

    }

    getUserInformationWithAllBooks(userId:number) {
        zip( this._bookService.getBooksByUserId(userId),
            this._usersService.getUserById(userId)
            ).subscribe(
                userwithBooks => this.handleShowModal(userwithBooks, this.modal)
        )
    }

    async handleShowModal(userInfo, modal:HTMLDivElement)
    {
        console.log(userInfo);
        modal.innerHTML = ""
        const modalContainer:HTMLDivElement = document.createElement("div");
        modalContainer.className = "modal-container"
        modal.appendChild(modalContainer);

        const exitModal:HTMLSpanElement = document.createElement("span");
        exitModal.className="close"
        exitModal.innerHTML = "&times;"
        exitModal.onclick =()=>{
            modal.style.display = "none"
        }
        modalContainer.appendChild(exitModal);

        // TitleModal

        const titleContainer:HTMLDivElement = document.createElement("div");
        modalContainer.appendChild(titleContainer)
        titleContainer.className = "title-container"
        

        const modalTitle :HTMLHeadingElement = document.createElement("h1");
        modalTitle.innerHTML = `${userInfo[1][0].first_name} ${userInfo[1][0].last_name}`;
        modalTitle.className = "modalTitle";
        titleContainer.appendChild(modalTitle);

        const modalDesc :HTMLHeadingElement = document.createElement("h3");
        modalDesc.innerHTML = `Rezervisane knjige:`;
        modalDesc.className = "modalTitle";
        titleContainer.appendChild(modalDesc);

        // ModalContent

        const modalContentContainer:HTMLDivElement = document.createElement("div");
        modalContentContainer.className = "modal-content-books"
        modalContainer.appendChild(modalContentContainer);

        if(userInfo[0].length != 0)
        {
            userInfo[0].map(book => {
                const bookInfoDiv:HTMLDivElement = document.createElement("div");
                bookInfoDiv.innerHTML = `${book.title} - ${book.author} [${book.genre}]`;
                bookInfoDiv.className = "book-info-modal";
                modalContainer.appendChild(bookInfoDiv)
            })
        }
        else{
            const bookInfoDiv:HTMLDivElement = document.createElement("div");
            bookInfoDiv.innerHTML = `Korisnik nema rezervisanih knjiga`;
            bookInfoDiv.className = "book-info-modal";
            modalContainer.appendChild(bookInfoDiv)
        }
        modal.style.display = "block"
    }

}