import { Request, Response } from "express";
export declare const studentRegister: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const studentLogin: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const staffRegister: (req: Request, res: Response) => Promise<void>;
export declare const staffLogin: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
//# sourceMappingURL=auth.controller.d.ts.map