import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
export declare class ServicesController {
    private static verifySalonOwnership;
    static findAll(req: any, res: Response): Promise<Response<any, Record<string, any>>>;
    static findOne(req: any, res: Response): Promise<Response<any, Record<string, any>>>;
    static create(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>>>;
    static update(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>>>;
    static remove(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>>>;
}
