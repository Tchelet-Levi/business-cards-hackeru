import { MongoError } from "mongodb";
import { UpdateUserBody } from "../../../types";
import { User } from "../models";
import { dbGetUserById } from "./dbGetUserById";
import { hashPassword } from "../../bcrypt/hashPassword";

export default async function dbUpdateUser(body: UpdateUserBody, user_id: string) {
  const filter = { user_id: user_id };
  let update = { $set: body };

  // If there is a password update request, make sure to re-hash it.
  if (body.password) {
    const hashedPassword = await hashPassword(body.password);

    update.$set["password"] = hashedPassword;
  }

  try {
    const doc = await User.findOneAndUpdate(filter, update, { upsert: true });
    const updated = await dbGetUserById(user_id);

    const user = { ...updated?.toObject() };

    return { success: true, message: user };
  } catch (e) {
    console.log(e);
    return { success: false, message: "Couldn't update user.." };
  }
}
