import { User } from "../models";

export async function dbGetUserById(user_id: string) {
  // Get the user from the database
  const user = await User.findOne(
    { user_id: user_id },
    {
      password: 0,
      _id: 0,
      __v: 0,
      user_id: 0,
    }
  );

  // Return false if could not find the user.
  if (user === null) return null;

  return user;
}
