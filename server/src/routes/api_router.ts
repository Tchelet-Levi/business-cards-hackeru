import { Router } from "express";
import { createCard } from "./api/createCard";
import { deleteCard } from "./api/deleteCard";
import { editCard } from "./api/editCard";
import { getAllCards } from "./api/getAllCards";
import { getMyCards } from "./api/getMyCards";
import { signin } from "./api/signin";
import { signup } from "./api/signup";
import { getUserInfo } from "./api/getUserInfo";
import updateUser from "./api/updateUser";
import { uploadImage } from "./api/uploadImage";
import deleteUser from "./api/deleteUser";

export const APIRouter = Router();

APIRouter.post("/signin", signin);
APIRouter.post("/signup", signup);
APIRouter.post("/create-card", createCard);
APIRouter.post("/edit-card", editCard);
APIRouter.post("/image/upload", uploadImage);
APIRouter.post("/user/update", updateUser);

APIRouter.get("/all-cards", getAllCards);
APIRouter.get("/my-cards", getMyCards);
APIRouter.get("/user", getUserInfo);

APIRouter.delete("/card", deleteCard);
APIRouter.delete("/user", deleteUser);
