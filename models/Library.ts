export interface ILibrary {
    id: number;
    name: string;
    img: string;
    address: string;
    telephone: string;
    email: string;
    year_opened: string;
    description: string;
}

export class Library implements ILibrary{
    id: number;
    name: string;
    img: string;
    address: string;
    telephone: string;
    email: string;
    year_opened: string;
    description: string;

    constructor() {}
}