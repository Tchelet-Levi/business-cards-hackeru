import { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store";
import { setToken } from "../tokenSlice";
import { useNavigate } from "react-router";
import { APIResponse } from "../types";

export default function useFetch<T>(input: RequestInfo | URL, init?: RequestInit | undefined) {
  const [data, setData] = useState<{ success: boolean; message: T | string } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<null | { message: string; code: number | null }>(null);

  // Handle tokens
  const token = useSelector((state: RootState) => state.tokenSlice);
  const dispatch = useDispatch();

  // Navigation
  const navigate = useNavigate();
  const [navigateTo, setNavigateTo] = useState("");

  // Main function to fetch data
  const fetchData = useCallback(async () => {
    try {
      // Include the token in the request
      const authorizationHeader = `Bearer ${token.value}`;
      const initWithToken: RequestInit = {
        headers: {
          Authorization: authorizationHeader,
        },
        ...init,
      };

      // Fetch the data
      const res = await fetch(input, initWithToken);

      // Get the X-Refresh-Token from the header
      const refreshToken = res.headers.get("X-Refresh-Token");

      // Get the data
      const d: APIResponse<T> = await res.json();

      // Finished loading
      setIsLoading(false);

      // Update the token
      dispatch(setToken(refreshToken));

      // If an error has occurred
      if (res.ok) {
        // Set data
        setData(d);
      } else {
        // If unauthorized, redirect to signin page.
        if (res.status === 401) {
          if (token.value) {
            setNavigateTo("/session-expired");
          } else {
            setNavigateTo("/signin");
          }
        }

        setData(d);
        setError({ code: res.status, message: d.message as string });
      }
    } catch (e: any) {
      // Fetch only throws on network failure, not on HTTP errors.
      console.log(e);
      setError({ code: null, message: "Could not connect to the server." });
    }
  }, [input, init]);

  useEffect(() => {
    fetchData();
  }, [input, init]);

  useEffect(() => {
    if (navigateTo !== "") {
      navigate(navigateTo);
      setNavigateTo("");
    }
  }, [navigateTo]);

  return { data, isLoading, error };
}
