import { MongoError } from "mongodb";
import { Card } from "../models";

export async function dbDeleteCard(card_id: string, user_id: string) {
  // Get card from DB
  const card = await Card.findOne({ card_id: card_id });

  // If null, card didn't exist in db.
  if (card === null) return { success: false, message: "Couldn't find card with the given id." };

  // Check if this user is the owner of this card
  if (card.owner_id !== user_id)
    return { success: false, message: `This user isn't the owner of this card.` };

  // Try to delete card
  try {
    await card.delete();
  } catch (e) {
    if (e instanceof MongoError) {
      return { success: false, message: e.message };
    }

    return { success: false, message: "Couldn't delete this card." };
  }

  return { success: true, message: `Successfully deleted card (id: ${card_id}).` };
}
