import { MongoError } from "mongodb";
import mongoose from "mongoose";
import { CreateCardBody, EditCardBody } from "../../../types";
import { Card } from "../models";

export async function dbEditCard(body: EditCardBody, card_id: string, user_id: string) {
  // Get card from DB
  const card = await Card.findOne({ card_id: card_id });

  // If null, card didn't exist in db.
  if (card === null) return { success: false, message: "Couldn't find card with the given id." };

  // Check if this user is the owner of this card
  if (card.owner_id !== user_id)
    return { success: false, message: `This user isn't the owner of this card.` };

  // Save card with new information
  try {
    await card.updateOne({ $set: body });
  } catch (e) {
    console.log(e);
    if (e instanceof MongoError) {
      console.log(e.message);
      return { success: false, message: e.message };
    }

    return { success: false, message: "Couldn't edit this card." };
  }

  return { success: true, message: card_id };
}
