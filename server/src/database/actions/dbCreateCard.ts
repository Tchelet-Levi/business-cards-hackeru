import { randomUUID } from "crypto";
import { MongoError } from "mongodb";
import { CreateCardBody } from "../../../types";
import { Card } from "../models";

export async function dbCreateCard(body: CreateCardBody, user_id: string) {
  // Create UUID for card
  const UUID = randomUUID();

  const date = new Date().toISOString();

  // Create card entry in db
  const createdCard = new Card({
    owner_id: user_id,
    card_id: UUID,
    createdOn: date,
    ...body,
  });

  // Save into db and return card UUID
  try {
    await createdCard.save();
    return { success: true, message: UUID };
  } catch (e) {
    if (e instanceof MongoError) {
      if (e.code === 11000) {
        return { success: false, message: "This business is already registered." };
      }
    }
    return { success: false, message: "General error.." };
  }
}
