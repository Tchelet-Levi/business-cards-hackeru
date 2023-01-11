import { Request, Response } from "express";
import { IExtendedRequest } from "../../../custom";
import dbDeleteUser from "../../database/actions/dbDeleteUser";

export default async function deleteUser(r: Request, res: Response) {
  // Convert type to include locals.user_id
  const req = r as IExtendedRequest;

  // Get user_id
  const user_id = req.locals.user_id;

  // Attempt to delete the user
  const isDeleted = await dbDeleteUser(user_id);

  if (isDeleted === true) {
    res.status(200).send({ success: true, message: `User ${user_id} successfully deleted.` });
  } else {
    res.status(404).send({
      success: false,
      message: `User ${user_id} not found, or an internal error has occurred.`,
    });
  }
}
