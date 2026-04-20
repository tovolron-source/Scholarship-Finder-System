import { Request, Response } from 'express';
export declare function getAllScholarships(req: Request, res: Response): Promise<void>;
export declare function getScholarshipById(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function searchScholarships(req: Request, res: Response): Promise<void>;
export declare function createScholarship(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function updateScholarship(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function deleteScholarship(req: Request, res: Response): Promise<void>;
