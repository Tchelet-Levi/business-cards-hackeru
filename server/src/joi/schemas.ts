import Joi from "joi";
import { isJSDocTypeExpression } from "typescript";

export const userUpdateSchemaJOI = Joi.object({
  email: Joi.string().email().min(6).max(256),
  password: Joi.string().min(6).max(128),
  fullName: Joi.string().min(4).max(256),
  avatar: Joi.string().max(500),
});

export const userRegisterSchemaJOI = Joi.object({
  email: Joi.string().email().required().min(6).max(256),
  password: Joi.string().min(6).max(128).required(),
  fullName: Joi.string().min(4).max(256).required(),
  isBusinessAccount: Joi.boolean().required(),
  avatar: Joi.string().max(500),
});

export const cardRegisterSchemaJOI = Joi.object({
  businessName: Joi.string().min(3).max(256).required(),
  businessDescription: Joi.string().min(3).max(1000).required(),
  businessAddress: Joi.string().min(3).max(256).required(),
  businessPhone: Joi.string().min(4).max(12).required(),
  businessImage: Joi.string().min(3).max(512),
});

export const cardEditSchemaJOI = Joi.object({
  businessName: Joi.string().min(3).max(256),
  businessDescription: Joi.string().min(3).max(1000),
  businessAddress: Joi.string().min(3).max(256),
  businessPhone: Joi.string().min(4).max(12),
  businessImage: Joi.string().min(3).max(512),
});
