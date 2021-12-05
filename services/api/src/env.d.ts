declare namespace NodeJS {
    export interface ProcessEnv {
        MONGO_URL: string;
        PORT: string;
        NODE_ENV?: string;
        JWT_KEY: string;
        CDN_ACCOUNT_ID: string;
        CDN_TOKEN: string;
        REPORT_WEBHOOK: string;
    }
}
