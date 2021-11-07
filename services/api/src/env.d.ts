declare namespace NodeJS {
    export interface ProcessEnv {
        MONGO_URL: string;
        PORT: string;
        NODE_ENV?: string;
        JWT_KEY: string;
    }
}
