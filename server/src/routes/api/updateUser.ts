import { Request, Response } from "express";
import { IExtendedRequest } from "../../../custom";
import { UpdateUserBody } from "../../../types";
import { userUpdateSchemaJOI } from "../../joi/schemas";
import { ValidationError } from "joi";
import dbUpdateUser from "../../database/actions/dbUpdateUser";

export default async function updateUser(r: Request, res: Response) {
  const req = r as IExtendedRequest;

  // Get the body from the request
  const body = req.body as UpdateUserBody;

  console.log(body);

  // Validate with JOI
  try {
    await userUpdateSchemaJOI.validateAsync(body);
  } catch (e) {
    if (e instanceof ValidationError) {
      return res.status(400).send({ success: false, message: e.message });
    }
    return res.status(400).send({ success: false, message: "Invalid input" });
  }

  // Try saving into db
  const dbResult = await dbUpdateUser(body, req.locals.user_id);

  return res.send(dbResult);
}
