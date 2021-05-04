
export interface IUser{
    id: number;
    first_name: string;
    last_name: string;
    library_id: number;
    member_sice: Date;
}

export class User implements IUser{
    id: number;
    first_name: string;
    last_name: string;
    library_id: number;
    member_sice: Date;
    
    constructor() {}
}