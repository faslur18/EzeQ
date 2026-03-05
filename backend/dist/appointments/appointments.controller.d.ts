import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
export declare class AppointmentsController {
    static findAll(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>>>;
    static findOne(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>>>;
    static create(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>>>;
    static updateStatus(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>>>;
    static remove(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>>>;
}
