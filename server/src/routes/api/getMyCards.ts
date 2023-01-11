import { Request, Response } from "express";
import { IExtendedRequest } from "../../../custom";
import { dbGetMyCards } from "../../database/actions/dbGetMyCards";

export async function getMyCards(req: Request, res: Response) {
  // Get user_id from request
  const user_id = (req as IExtendedRequest).locals.user_id;

  if (!user_id) {
    return res.status(401).send({ success: false, message: "Invalid token." });
  }

  // Get the cards
  const cards = await dbGetMyCards(user_id);

  // Send the cards
  return res.send({ success: true, message: cards });
}
