import { Card } from "../models";

export async function dbGetMyCards(user_id: string) {
  const cards = await Card.find({ owner_id: user_id }).sort({ createdOn: -1 });
  return cards;
}
