import { Request } from "express";

export interface IExtendedRequest extends Request {
  locals: {
    user_id: string;
  };
}
