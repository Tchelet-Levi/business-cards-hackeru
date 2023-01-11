import { Request, Response } from "express";
import { dbSignin } from "../../database/actions/dbSignin";
import { generateAccessToken } from "../../../src/jwt/jwt";
import { SignInBody } from "../../../types";
import { dbGetUserById } from "../../database/actions/dbGetUserById";

export async function signin(req: Request, res: Response) {
  try {
    // Get the body from the request
    const body = req.body as SignInBody;

    // Check if the credentials match with the database
    const dbRes = await dbSignin(body);

    // If match, return the accessToken
    if (typeof dbRes === "string") {
      // Get userId from db. Renamed for clarity.
      const userId = dbRes;

      // Create an accessToken that's valid for 30m
      const token = generateAccessToken({ user_id: userId }, "30m");

      // Get user data
      const user = await dbGetUserById(userId);

      // Respond with the token
      return res.status(200).send({
        success: true,
        message: {
          token: token,
          user: {
            fullName: user?.fullName,
            isBusinessAccount: user?.isBusinessAccount,
            email: user?.email,
            avatar: user?.avatar,
          },
        },
      });
    }

    // If email not found in database
    if (dbRes === null) {
      const response = {
        success: false,
        message: `No account is registered under the email '${body.email}'.`,
      };

      return res.status(404).send(response);
    }

    // If emails match, but passwords didn't.
    if (dbRes === false) {
      const response = {
        success: false,
        message: `The password was incorrect.`,
      };

      return res.status(401).send(response);
    }
  } catch (e) {
    return res.status(500).send({ success: false, message: "Internal error." });
  }
}
