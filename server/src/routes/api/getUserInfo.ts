import { Request, Response } from "express";
import { IExtendedRequest } from "../../../custom";
import { dbGetUserById } from "../../database/actions/dbGetUserById";

export async function getUserInfo(req: Request, res: Response) {
  const eReq = req as IExtendedRequest; // Redefine req

  // Get user id
  const user_id = eReq.locals.user_id;

  // Get user information from database
  const dbUser = await dbGetUserById(user_id);

  // If user doesn't exist in database
  if (dbUser === null) {
    return res.status(404).send({ success: false, message: "User not found." });
  }

  // User exists, format it accordingly
  let formatted: any = { ...dbUser.toObject() };

  // Remove unwanted properties
  delete formatted.__v;
  delete formatted._id;
  delete formatted.password;

  // User found, send back.
  return res.send({ success: true, message: formatted });
}
