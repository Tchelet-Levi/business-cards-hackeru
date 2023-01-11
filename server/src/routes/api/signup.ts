import { Request, Response } from "express";
import { userRegisterSchemaJOI } from "../../../src/joi/schemas";
import { ValidationError } from "joi";
import { RegisterUserBody } from "../../../types";
import { dbRegisterUser } from "../../database/actions/dbRegisterUser";
import { generateAccessToken } from "../../../src/jwt/jwt";

export async function signup(req: Request, res: Response) {
  // Get the body from the request
  const body = req.body as RegisterUserBody;

  // Verify that the request is valid through JOI
  try {
    const value = await userRegisterSchemaJOI.validateAsync(body);
  } catch (e) {
    if (e instanceof ValidationError) {
      return res.status(400).send({ success: false, message: e.message });
    }
    return res.status(400).send({ success: false, message: "Invalid input" });
  }

  // Register user in the database
  const { success, message } = await dbRegisterUser(body);
  const registered = success;

  // if successfully added to the database, return the user_id and the authorization header.
  if (registered) {
    // Rename message to userID
    const userId = message;

    // Create an accessToken that's valid for 30m
    const token = generateAccessToken({ user_id: userId }, "30m");

    // Send it to the client
    return res.status(201).send({ success: true, message: { token: token } });
  }

  // If unsuccessful, return the error message.
  if (!registered) return res.status(409).send({ success: false, message: message });
}
