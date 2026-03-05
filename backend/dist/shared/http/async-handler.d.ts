import { NextFunction, Request, RequestHandler, Response } from 'express';
type AsyncRouteHandler = (req: Request, res: Response, next: NextFunction) => Promise<unknown>;
export declare const asyncHandler: (handler: AsyncRouteHandler) => RequestHandler;
export {};
