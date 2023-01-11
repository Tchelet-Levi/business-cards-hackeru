import Joi, { ValidationError } from "joi";

export async function joiValidate(schema: Joi.ObjectSchema<any>, body: any) {
  try {
    const value = await schema.validateAsync(body);
    return { valid: true, message: value };
  } catch (e) {
    if (e instanceof ValidationError) {
      return { valid: false, message: e.message };
    }
    return { valid: false, message: "" };
  }
}
