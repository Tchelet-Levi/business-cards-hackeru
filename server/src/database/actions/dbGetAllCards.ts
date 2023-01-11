import { CardAPI, CardDatabase } from "../../../types";
import { Card } from "../models";

export async function dbGetAllCards(searchString: string = "", page?: string) {
  // Set default for page
  const numPage = Number(page) || 1;
  const maxCardsPerPage = 10;

  const data = await Card.find<CardDatabase>({
    businessName: { $regex: searchString, $options: "i" },
  })
    .sort({ createdOn: -1 })
    .limit(maxCardsPerPage)
    .skip(maxCardsPerPage * (numPage - 1));

  // Get maximum number of cards you can get (options: i = case insensitive)
  const count = await Card.count({ businessName: { $regex: searchString, $options: "i" } });

  // re-structure the data from the database to the API's interface
  const cards: CardAPI[] = data.map((card) => ({
    card_id: card.card_id,
    businessAddress: card.businessAddress,
    businessDescription: card.businessDescription,
    businessName: card.businessName,
    businessPhone: card.businessPhone,
    businessImage: card.businessImage,
    createdOn: card.createdOn,
  }));

  const res = {
    cards: cards,
    page: numPage,
    maxPages: Math.ceil(count / 10),
  };

  return res;
}
