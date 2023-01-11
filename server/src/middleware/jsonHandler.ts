import { NextFunction, Request, Response } from "express";

// Handles errors in JSON body parser
export function jsonErrorHandler(err: unknown, req: Request, res: Response, next: NextFunction) {
  if (err instanceof SyntaxError) {
    console.error(err.message);
    return res.status(400).send({ success: false, message: err.message });
  }
  next();
}
