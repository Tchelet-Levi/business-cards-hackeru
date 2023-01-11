import { Request, Response } from "express";
import { IExtendedRequest } from "../../../custom";
import { dbEditCard } from "../../database/actions/dbEditCard";
import { joiValidate } from "../../../src/joi/joiValidate";
import { cardEditSchemaJOI } from "../../../src/joi/schemas";
import { EditCardBody } from "../../../types";

export async function editCard(req: Request, res: Response) {
  // Get the body from the request
  const body = req.body as EditCardBody;

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

  // Validate with JOI
  const { valid, message: joiMessage } = await joiValidate(cardEditSchemaJOI, body);

  // If the request has invalid format, refuse the request.
  if (!valid) return res.status(400).send({ success: false, message: joiMessage });

  // If valid, move to the database.
  const { success, message: mongoMessage } = await dbEditCard(body, cardId, userId);

  // Unsuccessful request
  if (!success) return res.status(400).send({ success: false, message: mongoMessage });

  // Successful request
  return res.status(200).send({ success: true, message: { card_id: mongoMessage } });
}
