import type { Request, Response, NextFunction } from "express";

export const logger = (req: Request, res: Response, next: NextFunction) => {
  console.log("Header", req.headers);
  console.log("Body before routes", req.body);
  next();
};
