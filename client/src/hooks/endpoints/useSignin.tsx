import React from "react";
import useFetch from "../useFetch";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store";
import { setToken } from "../../tokenSlice";

type Props = {
  email: string;
  password: string;
};

export default function useSignin({ email, password }: Props) {
  // Redux
  const dispatch = useDispatch();

  // Fetch data
  type Res = { token: string };
  const { data, isLoading, error } = useFetch<Res>(`/api/signin`);

  // If successful
  if (data?.success === true) {
    // redefine the type of message to correctly reflect how it looks on success
    const d = data.message as Res;

    // Get the token
    let token = d.token;

    // Update token state
    dispatch(setToken(token));
  }

  return { isLoading, error };
}
