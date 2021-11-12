import type { IUser } from "../db/models/User";

declare module "express" {
    export interface Request { 
        user?: IUser
    }
}
