import { Request, Response } from "express";
import { IExtendedRequest } from "../../../custom";
import { dbCreateCard } from "../../database/actions/dbCreateCard";
import { joiValidate } from "../../../src/joi/joiValidate";
import { cardRegisterSchemaJOI } from "../../../src/joi/schemas";
import { CreateCardBody } from "../../../types";

export async function createCard(req: Request, res: Response) {
  /**
   * Validate through JOI that everything is in order.
   * Create card in the database
   */

  // Get body from request.
  const body = req.body as CreateCardBody;

  // validate joi
  const { valid, message } = await joiValidate(cardRegisterSchemaJOI, body);

  if (!valid) {
    return res.status(400).send({ success: false, message: message });
  }

  if (valid) {
    // Send request to database.
    const { success, message } = await dbCreateCard(body, (req as IExtendedRequest).locals.user_id);

    if (success) {
      return res.status(201).send({ success: true, message: message });
    }

    if (!success) {
      return res.status(409).send({ success: false, message: message });
    }
  }
}
