import { useNavigate } from "react-router";
import usePageName from "../hooks/usePageName";
import { useDispatch } from "react-redux";
import { setToken } from "../tokenSlice";
import React from "react";

export default function useSignOut() {
  // Redux
  const dispatch = useDispatch();

  // Navigation
  const navigate = useNavigate();

  function signout() {
    // Clear token
    dispatch(setToken(null));

    // Navigate to sign in
    navigate("/signin");
  }

  return React.useCallback(signout, []);
}
