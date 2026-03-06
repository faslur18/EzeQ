import { Response } from 'express';
export declare class AdminSalonsController {
    static findAll(req: any, res: Response): Promise<Response<any, Record<string, any>>>;
    static updateStatus(req: any, res: Response): Promise<Response<any, Record<string, any>>>;
}
