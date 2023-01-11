import { string } from "joi";
import mongoose from "mongoose";

export const userSchema = new mongoose.Schema({
  user_id: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  fullName: { type: String, required: true },
  isBusinessAccount: { type: Boolean, required: true },
  avatar: { type: String },
});

export const cardSchema = new mongoose.Schema({
  owner_id: { type: String, required: true },
  createdOn: { type: String, required: true },
  card_id: { type: String, required: true, unique: true },
  businessName: { type: String, required: true, unique: true },
  businessDescription: { type: String, required: true },
  businessAddress: { type: String, required: true },
  businessPhone: { type: String, required: true },
  businessImage: { type: String },
});

export const imageSchema = new mongoose.Schema({
  picture_id: { type: String, required: true, unique: true },
  owner_id: { type: String, required: true },
  name: { type: String, required: true },
  path: { type: String, required: true, unique: true },
});
