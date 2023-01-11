import jwt from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";
import { generateAccessToken, noTokenSecretError } from "../jwt/jwt";
import { IExtendedRequest } from "../../custom";

const TOKEN_SECRET = process.env.TOKEN_SECRET;

const UNPROTECTED_ROUTES: string[] = ["/api/signin", "/api/signup"];

export function jwtAuthorizeMiddleware(req: Request, res: Response, next: NextFunction) {
  // Throw error if no TOKEN_SECRET was defined in the .env file.
  if (!TOKEN_SECRET) throw noTokenSecretError;

  // If we are in an unprotected route, just go to the next middleware.
  if (UNPROTECTED_ROUTES.includes(req.url)) return next();

  // Get token through Authorization header
  const token = req.get("Authorization")?.split(" ")[1];

  // If there wasn't a token, end the connection.
  if (!token)
    return res
      .status(401)
      .send({ success: false, message: `Token is invalid. Please sign in again.` });

  // Verify that the token is correct.
  jwt.verify(
    token,
    TOKEN_SECRET,
    (error: jwt.VerifyErrors | null, decoded: string | jwt.JwtPayload | undefined) => {
      // Token invalid. End connection.
      if (error)
        return res.status(401).send({
          success: false,
          message: "Invalid token. Please sign in again.",
        });

      // if no errors, set the user_id in the req.locals
      const user_id = (decoded as { user_id: string }).user_id;
      (req as IExtendedRequest).locals = { user_id: user_id };

      // Create a refresh token and set it in the headers under X-Refresh-Token.
      const token = generateAccessToken({ user_id: user_id }, "30m");

      // Set header
      res.set("X-Refresh-Token", token);

      // next middleware
      return next();
    }
  );
}
