import { Request, Response } from "express";
import { IExtendedRequest } from "../../../custom";
import { randomUUID } from "crypto";
import { UploadFileBody } from "../../../types";
import path from "path";
import appRoot from "app-root-path";
import dbUploadImage from "../../database/actions/dbUploadImage";

export async function uploadImage(req: Request, res: Response) {
  const reqExtended = req as IExtendedRequest;

  // If no files were provided.
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send({ success: false, message: "No files were uploaded." });
  }

  if (!req.files.image) {
    return res.status(400).send({
      success: false,
      message: "No images were uploaded. Make sure the name of the input is set to 'image'.",
    });
  }

  let imageFile = Array.isArray(req.files.image) ? req.files.image[0] : req.files.image;

  const extensionName = path.extname(imageFile.name);
  const allowedExtensions = [".png", ".jpg", ".jpeg"];

  if (!allowedExtensions.includes(extensionName)) {
    return res.status(422).send({ success: false, message: "Invalid image format." });
  }

  const basePath = `assets/users/${reqExtended.locals.user_id}/images`;
  const fileName = `${imageFile.md5}`;
  const relativePath = `${basePath}/${fileName}${extensionName}`;
  const uploadPath = `${appRoot.path}/${relativePath}`;

  try {
    // Save file locally
    await imageFile.mv(uploadPath);

    // Save file metadata in db
    await dbUploadImage(reqExtended.locals.user_id, imageFile.name, uploadPath);

    return res.send({ success: true, message: relativePath });
  } catch (e) {
    return res.status(500).send({ success: false, message: "General error. Did not upload file." });
  }
}
