import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
export declare class UsersController {
    static findAll(req: any, res: Response): Promise<Response<any, Record<string, any>>>;
    static findOne(req: any, res: Response): Promise<Response<any, Record<string, any>>>;
    static updateRole(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>>>;
    static remove(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>>>;
}
