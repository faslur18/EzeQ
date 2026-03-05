import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
export declare class HoursController {
    private static verifySalonOwnership;
    static findAll(req: any, res: Response): Promise<Response<any, Record<string, any>>>;
    static setAll(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>>>;
    static update(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>>>;
    static remove(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>>>;
}
