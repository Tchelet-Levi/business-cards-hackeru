import { MongoError } from "mongodb";
import { User } from "../models";
import { randomUUID } from "crypto";
import { Image } from "../models";

export default async function dbUploadImage(user_id: string, name: string, path: string) {
  const document = {
    picture_id: randomUUID(),
    owner_id: user_id,
    name: name,
    path: path,
  };

  const createdImage = new Image(document);

  try {
    await createdImage.save();
    return { success: true, message: createdImage.toObject() };
  } catch (e) {
    return { success: false, message: "General error.." };
  }
}
