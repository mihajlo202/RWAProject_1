export interface IBook {
    id: number;
    author: string;
    genre: string;
    title: string;
    img: string;
    library_id: number;
    value: number;
    available: boolean;
    time_taken: string;
    user_id: number;
}

export class Book implements IBook{
    id: number;
    author: string;
    genre: string;
    title: string;
    img: string;
    library_id: number;
    value: number;
    available: boolean;
    time_taken: string;
    user_id: number;
    
    constructor() {}
}