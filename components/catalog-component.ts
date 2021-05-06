import { BookService } from "../services/book-service";
import { selectorValues } from "../constants/selectors-constants"
import { Book } from "../models/Book";
import { flatMap, take, scan, map, debounceTime, switchMap, filter, pairwise, mergeMap, withLatestFrom } from "rxjs/operators";
import { fromEvent, range } from "rxjs";
import { LibraryService } from "../services/library-service";
import { UserService } from "../services/user-service";

export class CatalogComponent {
    _contentContainer:HTMLDivElement;
    _bookService:BookService;
    _libraryService:LibraryService
    _searchInput: string;
    modal:HTMLDivElement;
    constructor() {
        this._contentContainer = document.getElementById("content-container") as HTMLDivElement;
        this._bookService = new BookService();
        this._libraryService = new LibraryService();
        this.modal = null;
    }

    drawCatalog() {
        this._contentContainer.innerHTML = "";

        this.handleCreateModal(this._contentContainer);

        const catalogContainer:HTMLDivElement = document.createElement("div");
        catalogContainer.className = "catalog-container";
        this._contentContainer.appendChild(catalogContainer);

        const catalogHeader:HTMLDivElement = document.createElement("div");
        catalogHeader.className = "catalog-header";
        catalogHeader.innerHTML = "<p>Katalog knjiga</p>";
        catalogContainer.appendChild(catalogHeader);
        
        catalogContainer.appendChild(this.getCatalogSearch());

        const statistic:HTMLDivElement = document.createElement("div");
        statistic.id = "statistic";
        catalogContainer.appendChild(statistic)

        const tableContainer:HTMLDivElement = document.createElement("div");
        tableContainer.className = "table-container";
        catalogContainer.appendChild(tableContainer); 

        const tableCatalog:HTMLTableElement = document.createElement("table");
        tableCatalog.id = "book-catalog"
        tableContainer.appendChild(tableCatalog); 

        let selectorValue = parseInt((document.getElementById("number-of-books") as HTMLSelectElement).value);
        let searchValue = (document.getElementById("search-input-id") as HTMLInputElement).value;
        this.drawTable(tableCatalog, selectorValue, searchValue);
    }

    getCatalogSearch():HTMLDivElement {
        const searchOptions:HTMLDivElement = document.createElement("div");
        searchOptions.className = "search-options";

        const selectNumberOfItems:HTMLSelectElement = document.createElement("select");
        selectNumberOfItems.className = "form-select search-options-select";
        selectNumberOfItems.id = "number-of-books";
        const selectOptionAll:HTMLOptionElement = document.createElement("option");
            selectOptionAll.value = "-1";
            selectOptionAll.text = "Prikaži sve";
            selectNumberOfItems.appendChild(selectOptionAll);
        selectorValues.SELECTOR_VALUES.forEach(val => {
            const selectOption:HTMLOptionElement = document.createElement("option");
            selectOption.value = val.toString();
            selectOption.text = val.toString();
            selectNumberOfItems.appendChild(selectOption);
        })
        selectNumberOfItems.value = "-1";
        searchOptions.appendChild(selectNumberOfItems);

        const searchInput:HTMLInputElement = document.createElement("input");
        searchInput.id = "search-input-id";
        searchInput.className = 'search-options-input';
        searchInput.type = "text";
        searchInput.placeholder = "Unesite text za pretragu...";
        searchOptions.append(searchInput);

        const searchButton:HTMLButtonElement = document.createElement("button");
        searchButton.className = "search-button btn btn-primary";
        searchButton.id = "btn-search"
        searchButton.innerHTML = "Pretraži";
        searchButton.type ="submit";
        searchButton.onclick = () => {
            let selectorValue = parseInt((document.getElementById("number-of-books") as HTMLSelectElement).value);
            let searchInput = (document.getElementById("search-input-id") as HTMLInputElement);
            let table = (document.getElementById("book-catalog") as HTMLTableElement);
            this.drawTable(table, selectorValue, searchInput.value)
        }
        searchOptions.appendChild(searchButton);

        return searchOptions;
    }

    drawTable(table:HTMLTableElement, selectorValue:number, searchValue:string) {
        table.innerHTML = ""
        table.appendChild(this.getTableHeader());
        if(selectorValue !== -1)
        {
            this._bookService.getBookBySearchValue(searchValue).pipe(
                mergeMap(book => book),
                take(selectorValue)
            ).subscribe(book => table.appendChild(this.getBookElement(book)));
        }
        else
        {
            this._bookService.getBookBySearchValue(searchValue).pipe(
                mergeMap(book => book),
            ).subscribe(book => table.appendChild(this.getBookElement(book)));
        }
        this.updateStatistic(searchValue,selectorValue);
    }

    updateStatistic(text:string,selectVal:number) {
        const statistic = document.getElementById("statistic") as HTMLDivElement;
        this._bookService.getBookByParametarsPromise(text, selectVal)
        .then(res => { return res.json() })
        .then(bookList => {
            let numberOfBooks = bookList.reduce((acc => { return acc + 1 }), 0);
            statistic.innerHTML = `<span>Prikazano knjiga: </span> ${numberOfBooks}`;
        })
    }

    getBookElement(book:Book):HTMLTableRowElement {
        const bookRow:HTMLTableRowElement = document.createElement("tr");
        bookRow.innerHTML = `<td><img class="book-cover" src=${book.img}></img></td>
                            <td>${book.title}</td>
                            <td>${book.author}</td>
                            <td>${book.genre}</td>`
        bookRow.onclick = () => {
            this.drawSingleBook(book);
        }
        return bookRow;
    }

    drawSingleBook(book:Book) {
        this.handleShowModal(book, this.modal)
    }

    getTableHeader():HTMLTableSectionElement {
        const tableHeader:HTMLTableSectionElement = document.createElement("thead");
        tableHeader.innerHTML = `<tr>
                                    <th>Slika</th>
                                    <th>Naslov</th>
                                    <th>Autor</th>
                                    <th>Tip</th>
                                </tr>`;
        return tableHeader;
    }

    handleCreateModal(parent:HTMLElement){
        let modelContainer: HTMLDivElement = document.createElement("div");
        modelContainer.className = "modal"
        this.modal = modelContainer;
        parent.appendChild(modelContainer)

    }

    async handleShowModal(book:Book, modal:HTMLDivElement)
    {

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
        modalTitle.innerHTML = book.title;
        modalTitle.className = "modalTitle";
        titleContainer.appendChild(modalTitle);

        // ModalContent

        const modalContentContainer:HTMLDivElement = document.createElement("div");
        modalContentContainer.className = "modal-content-container"
        modalContainer.appendChild(modalContentContainer);

        // Left

        const leftContentContainer:HTMLDivElement = document.createElement("div");
        leftContentContainer.className = "modal-content-container-left";
        modalContentContainer.appendChild(leftContentContainer);

        const bookImage:HTMLImageElement = document.createElement("img");
        bookImage.src = book.img;
        bookImage.className = "book-image-modal"
        leftContentContainer.appendChild(bookImage)

        // Right

        const rightContentContainer  = document.createElement("div");
        rightContentContainer.className = "modal-content-container-right";
        modalContentContainer.appendChild(rightContentContainer);

        const authorDiv:HTMLDivElement = document.createElement("div");
        authorDiv.className = "author-div";
        authorDiv.innerHTML ="Autor: " + book.author;
        rightContentContainer.appendChild(authorDiv);

        const genreDiv:HTMLDivElement = document.createElement("div");
        genreDiv.className = "genre-div";
        genreDiv.innerHTML ="Tip: " + book.genre;
        rightContentContainer.appendChild(genreDiv);

        const valueDiv:HTMLDivElement = document.createElement("div");
        valueDiv.className = "genre-div";
        valueDiv.innerHTML ="Vrednost: " + book.value + " din";
        rightContentContainer.appendChild(valueDiv);

        await this._libraryService.getLibraryByIdPromise(book.library_id)
        .then(res => { return res.json() })
        .then(library => {
            const libraryDiv:HTMLDivElement = document.createElement("div");
            libraryDiv.className = "library-div";
            libraryDiv.innerHTML ="Biblioteka: " + library.name;
            rightContentContainer.appendChild(libraryDiv);
        })

        if(book.available)
        {
            const reseveBook:HTMLDivElement = document.createElement("div");
            reseveBook.className = "reseveBook-div";
            rightContentContainer.appendChild(reseveBook);

            const idInput:HTMLInputElement = document.createElement("input");
            idInput.id= "reserve-id"
            idInput.placeholder = "Unesite vaš id...";
            idInput.type = "number";
            reseveBook.appendChild(idInput);

            const btnReseve:HTMLButtonElement = document.createElement("button");
            btnReseve.className = "btnSuccess"
            btnReseve.innerText = "Rezerviši";
            btnReseve.onclick =(ev)=>{
                const idUser:number = parseInt((document.getElementById("reserve-id") as HTMLInputElement).value);
                const userService = new UserService();
                userService.getUserByIdPromise(idUser)
                .then(user => user.json())
                .then(user => {
                        if(user.length===0)
                        {
                            alert("Ne postoji radnik sa tim JMBG-om");
                            return;
                        }
                        book.available = false;
                        book.time_taken = new Date().toUTCString();
                        book.user_id = user.id;
                        this._bookService.updateBookAvailability(book);
                        modal.style.display = "none";
                        setTimeout(()=>{location.reload()}, 500);
                        
                    })
                }
            reseveBook.appendChild(btnReseve);
                
            }
        modal.style.display = "block"
    }

}