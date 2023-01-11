import React from "react";
import { ISignUpForm } from "../../types";
import useFetchBasic from "../useFetchBasic";
import { useDispatch } from "react-redux";
import { setToken } from "../../tokenSlice";

export default function useSignup() {
  const fetchBasic = useFetchBasic();

  // Redux
  const dispatch = useDispatch();

  async function signup(body: ISignUpForm) {
    const res = await fetchBasic("/api/signup", {
      method: "POST",
      body: JSON.stringify(body),
      headers: { "Content-Type": "application/json" },
    });

    const data = await res.json();
    const { success, message } = data;

    if (success) {
      dispatch(setToken(message.token));
    }

    return data;
  }

  return React.useCallback(signup, []);
}
