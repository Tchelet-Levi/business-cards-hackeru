import mongoose from "mongoose";
import { userSchema, cardSchema, imageSchema } from "./schemas";

export const User = mongoose.model("User", userSchema);
export const Card = mongoose.model("Card", cardSchema);
export const Image = mongoose.model("Image", imageSchema);
