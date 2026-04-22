import { Request, Response } from 'express';
export declare function getApplicationsByStudent(req: Request, res: Response): Promise<void>;
export declare function checkApplicationExists(req: Request, res: Response): Promise<void>;
export declare function createApplication(req: Request, res: Response): Promise<void>;
export declare function getApplicationsByScholarship(req: Request, res: Response): Promise<void>;
export declare function updateApplicationStatus(req: Request, res: Response): Promise<void>;
export declare function getApplicationById(req: Request, res: Response): Promise<void>;
export declare function approveApplication(req: Request, res: Response): Promise<void>;
export declare function rejectApplication(req: Request, res: Response): Promise<void>;
