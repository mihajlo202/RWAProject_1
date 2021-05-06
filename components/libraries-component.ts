import { filter, mergeMap, scan } from "rxjs/operators";
import { Library } from "../models/Library";
import { BookService } from "../services/book-service";
import { LibraryService } from "../services/library-service";
import { UserService } from "../services/user-service";

export class LibrariesComponent {
    _librariesService:LibraryService;
    _bookService:BookService;
    _usersService:UserService;
    _contentContainer:HTMLDivElement;
    modal:HTMLDivElement;
    constructor() {
        this._contentContainer = document.getElementById("content-container") as HTMLDivElement;
        this._librariesService = new LibraryService();
        this._bookService = new BookService();
        this._usersService = new UserService();
        this.modal = null;
    }

    drawLibraries() {
        this._contentContainer.innerHTML = ""
        this.handleCreateModal(this._contentContainer);

        const catalogContainer:HTMLDivElement = document.createElement("div");
        catalogContainer.className = "catalog-container";
        this._contentContainer.appendChild(catalogContainer);

        const catalogHeader:HTMLDivElement = document.createElement("div");
        catalogHeader.className = "catalog-header";
        catalogHeader.innerHTML = "<p>Biblioteke</p>";
        catalogContainer.appendChild(catalogHeader);

        
        const tableContainer:HTMLDivElement = document.createElement("div");
        tableContainer.className = "table-container";
        catalogContainer.appendChild(tableContainer); 

        const tableCatalog:HTMLTableElement = document.createElement("table");
        tableCatalog.id = "book-catalog"
        tableContainer.appendChild(tableCatalog); 

        this.drawTable(tableCatalog);
    }


    drawTable(table:HTMLTableElement) {
        table.innerHTML = ""
        table.appendChild(this.getTableHeader());
            this._librariesService.getLibraries().pipe(
                mergeMap(library => library),
            ).subscribe(library => table.appendChild(this.getLibraryElement(library)));
    }

    getLibraryElement(library:Library):HTMLTableRowElement {
        const libraryRow:HTMLTableRowElement = document.createElement("tr");
        libraryRow.innerHTML = `<td><img class="book-cover" src=${library.img}></img></td>
                            <td>${library.name}</td>
                            <td>${library.address}</td>
                            <td>${library.email}</td>
                            <td>${library.telephone}</td>`
        libraryRow.onclick = () => {
            this.drawSingleLibrary(library);
        }
        return libraryRow;
    }

    drawSingleLibrary(library:Library) {
        this.handleShowModal(library, this.modal)
    }

    getTableHeader():HTMLTableSectionElement {
        const tableHeader:HTMLTableSectionElement = document.createElement("thead");
        tableHeader.innerHTML = `<tr>
                                    <th>Slika</th>
                                    <th>Naziv</th>
                                    <th>Adresa</th>
                                    <th>Email</th>
                                    <th>Telefon</th>
                                </tr>`;
        return tableHeader;
    }

    handleCreateModal(parent:HTMLElement){
        let modelContainer: HTMLDivElement = document.createElement("div");
        modelContainer.className = "modal"
        this.modal = modelContainer;
        parent.appendChild(modelContainer)

    }

    async handleShowModal(library:Library, modal:HTMLDivElement)
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
        modalTitle.innerHTML = library.name;
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
        bookImage.src = library.img;
        bookImage.className = "library-image-modal"
        leftContentContainer.appendChild(bookImage)

        // Right

        const rightContentContainer  = document.createElement("div");
        rightContentContainer.className = "modal-content-container-right";
        modalContentContainer.appendChild(rightContentContainer);

        const authorDiv:HTMLDivElement = document.createElement("div");
        authorDiv.className = "author-div";
        authorDiv.innerHTML ="Adresa: " + library.address;
        rightContentContainer.appendChild(authorDiv);

        const genreDiv:HTMLDivElement = document.createElement("div");
        genreDiv.className = "genre-div";
        genreDiv.innerHTML ="Email: " + library.email;
        rightContentContainer.appendChild(genreDiv);

        const valueDiv:HTMLDivElement = document.createElement("div");
        valueDiv.className = "genre-div";
        valueDiv.innerHTML ="Telefon: " + library.telephone;
        rightContentContainer.appendChild(valueDiv);

        const yearDiv:HTMLDivElement = document.createElement("div");
        yearDiv.className = "year-div";
        yearDiv.innerHTML ="Godina: " + library.year_opened;
        rightContentContainer.appendChild(yearDiv);

        const numberUsers:HTMLDivElement = document.createElement("div");
        numberUsers.id = "number-of-users";
        numberUsers.className = "number-div"
        rightContentContainer.appendChild(numberUsers);

        const numberBooks:HTMLDivElement = document.createElement("div");
        numberBooks.id = "number-of-books";
        numberBooks.className = "number-div"
        rightContentContainer.appendChild(numberBooks);

        const valueOfBooks:HTMLDivElement = document.createElement("div");
        valueOfBooks.id = "value-of-books";
        valueOfBooks.className = "number-div"
        rightContentContainer.appendChild(valueOfBooks);

        this.updateNumberOfBooksLabel(library.id);
        this.updateNumberOfUsersLabel(library.id);
        this.updateValueOfBooksLabel(library.id);
        modal.style.display = "block"
    }

    updateNumberOfUsersLabel(libraryId) {
        this._usersService.getUsersByLibrary(libraryId)
            .then(res => { return res.json() })
            .then(patronList => {
                let numberOdUsers = patronList.reduce((acc => { return acc + 1 }), 0);
                let numberOdUsersLabel = document.getElementById("number-of-users");
                numberOdUsersLabel.innerHTML = `Broj korisnika: ${numberOdUsers}`;
            });
    }

    updateValueOfBooksLabel(libraryId) {
        this._bookService.getBooks().pipe(
            mergeMap(book => book),
            filter(book => book.library_id === libraryId),
            scan(((acc, book) => acc + book.value), 0)
        ).subscribe(valueOfBooks => {
            let valueOfBooksLabel = document.getElementById("value-of-books");
            valueOfBooksLabel.innerHTML = `Ukupna vrednost: ${valueOfBooks}`;
        })
    }

    updateNumberOfBooksLabel(libraryId) {
        this._bookService.getBooks().pipe(
            mergeMap(book => book),
            filter(book => book.library_id === libraryId),
            scan((acc => acc + 1), 0)
        ).subscribe(numberOfBooks => {
            let numberOfBooksLabel = document.getElementById("number-of-books");
            numberOfBooksLabel.innerHTML = `Broj knjiga: ${numberOfBooks}`;
        })
    }
}