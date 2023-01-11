import { Request, Response } from "express";
import { dbGetAllCards } from "../../database/actions/dbGetAllCards";

export async function getAllCards(req: Request, res: Response) {
  // Get search param if any, or make it undefined.
  let searchString = req.query.search;
  if (typeof searchString !== "string") searchString = undefined;

  // Get page param if any, or make it undefined.
  let page = req.query.page;
  if (typeof page !== "string") page = undefined;

  // Get the cards
  const cards = await dbGetAllCards(searchString, page);

  // Send the cards
  res.send({ success: true, message: cards });
}
