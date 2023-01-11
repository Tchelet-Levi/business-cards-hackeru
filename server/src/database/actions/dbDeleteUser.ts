import mongoose from "mongoose";
import { dbConnection } from "../database_manager";
import { Card, Image, User } from "../models";

export default async function dbDeleteUser(user_id: string) {
  let success: boolean = false;

  // Create session for transaction
  const session = await dbConnection.startSession();
  try {
    // Transaction
    await session.withTransaction(async () => {
      // ** Delete everything that is associated with this user_id. **

      // Delete user.
      await User.deleteMany({ user_id: user_id });

      // Delete all cards associated with this user.
      await Card.deleteMany({ owner_id: user_id });

      // Delete all Images uploaded by this user.
      await Image.deleteMany({ owner_id: user_id });

      // If the above succeeds, commit the transaction.
      await session.commitTransaction();

      success = true;
    });
  } catch (e) {
    console.error(e);

    // Abort the transaction in case of failure
    await session.abortTransaction();
    success = false;
  }

  // End the session
  session.endSession();

  // Return whether we succeeded or not.
  return success;
}
