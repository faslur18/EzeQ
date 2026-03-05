import { Request, Response, NextFunction } from 'express';
export interface AuthRequest extends Request {
    user?: {
        sub: string;
        role: string;
        email: string;
        name: string;
    };
}
export declare const authenticate: (req: AuthRequest, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
export declare const authorize: (roles: string[]) => (req: AuthRequest, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
