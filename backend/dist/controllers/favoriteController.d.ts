import { Request, Response } from 'express';
export declare function getFavoritesByStudent(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function checkIsFavorited(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function addFavorite(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function removeFavorite(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
