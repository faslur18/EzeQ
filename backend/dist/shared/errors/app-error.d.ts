export declare class AppError extends Error {
    readonly statusCode: number;
    readonly code: string;
    readonly details?: unknown;
    constructor(statusCode: number, message: string, code?: string, details?: unknown);
}
