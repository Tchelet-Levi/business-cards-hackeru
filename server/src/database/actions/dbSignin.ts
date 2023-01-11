import { SignInBody } from "../../../types";
import { User } from "../models";
import bcrypt from "bcrypt";

/**
 *
 * @param body
 * @returns user_id if credentials match, false, if credentials don't match, or null if could not find user by email.
 */
export async function dbSignin(body: SignInBody) {
  // Get the user from the database
  const user = await User.findOne({ email: body.email });

  // Return false if could not find the user.
  if (user === null) return null;

  // Get the hashed password from the user
  const hashedPassword = user.password;

  // Compare the two
  const isMatch = await bcrypt.compare(body.password, hashedPassword);

  // If the password matched return true; can sign in.
  if (isMatch) return user.user_id;

  // If the password didn't match, return false.
  return false;
}
