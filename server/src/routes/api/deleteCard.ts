import { Request, Response } from "express";
import { IExtendedRequest } from "../../../custom";
import { dbDeleteCard } from "../../database/actions/dbDeleteCard";

export async function deleteCard(req: Request, res: Response) {
  // Card ID to edit
  const cardId = req.query.id;

  // Get the userID of the owner of this card
  const userId = (req as IExtendedRequest).locals.user_id;

  // Shouldn't happen, but if for some reason there wasn't a user_id in the request, end the connection.
  if (!userId) {
    return res.status(401).end();
  }

  // If the card id is in invalid format or not supplemented at all, reject the request.
  if (typeof cardId !== "string") {
    return res
      .status(400)
      .send({ success: false, message: `No card id supplemented in the request.` });
  }

  const { success, message } = await dbDeleteCard(cardId, userId);

  // If unsuccessful
  if (!success) return res.status(400).send({ success: false, message: message });

  // If successful
  return res.status(200).send({ success: true, message: message });
}
