import { randomUUID } from "crypto";
import { MongoError } from "mongodb";
import { RegisterUserBody } from "../../../types";
import { User } from "../models";
import { hashPassword } from "../../bcrypt/hashPassword";

export async function dbRegisterUser(body: RegisterUserBody) {
  // Create a new user to save in DB with a random UUID attached to it.
  const UUID = randomUUID();

  // Create a hash for the password
  const hashedPassword = await hashPassword(body.password);

  // Create an entry in the db
  const createdUser = new User({ user_id: UUID, ...body, password: hashedPassword });

  // Save into the database and return its UUID.
  try {
    await createdUser.save();
    return { success: true, message: UUID };
  } catch (e) {
    if (e instanceof MongoError) {
      if (e.code === 11000) {
        return { success: false, message: "This email is already in use." };
      }
    }
    return { success: false, message: "General error.." };
  }
}
