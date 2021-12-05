import type { RestUtil } from "#util/rest";
import type { IUser } from "../db/models/User";

declare module "express" {
    export interface Request { 
        user?: IUser
    }
}

declare module "express-serve-static-core" {
    export interface Application {
         reporter: RestUtil
     }
 }