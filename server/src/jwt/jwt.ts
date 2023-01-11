import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

const TOKEN_SECRET = process.env.TOKEN_SECRET;
export const noTokenSecretError = new Error(
  "Fatal error: Could not find TOKEN_SECRET environment variable. Please make sure the environment variables are set up correctly in the .env file."
);

export function generateAccessToken(payload: any, expiration: string) {
  // Throw an error if no TOKEN_SECRET was defined in the .env file.
  if (!TOKEN_SECRET) throw noTokenSecretError;

  return jwt.sign(payload, TOKEN_SECRET, { expiresIn: expiration });
}
