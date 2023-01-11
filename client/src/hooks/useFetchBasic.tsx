import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store";
import { useCallback, useEffect, useState } from "react";
import { setToken } from "../tokenSlice";
import { useNavigate } from "react-router";

export default function useFetchBasic() {
  // Handle tokens
  const token = useSelector((state: RootState) => state.tokenSlice);
  const dispatch = useDispatch();

  const navigate = useNavigate();
  const [navigateTo, setNavigateTo] = useState("");

  // Main function to fetch data
  const fetchData = useCallback(
    async (input: RequestInfo | URL, init?: RequestInit | undefined) => {
      // Include the token in the request
      const authorizationHeader = `Bearer ${token.value}`;
      const initWithToken: RequestInit = {
        ...init,
        headers: {
          Authorization: authorizationHeader,
          ...init?.headers,
        },
      };

      // Fetch the data
      const res = await fetch(input, initWithToken);

      if (res.status === 401) {
        console.log(token.value);
        if (token.value) {
          setNavigateTo("/session-expired");
        } else {
          setNavigateTo("/signin");
        }
      }

      // Get the X-Refresh-Token from the header
      const refreshToken = res.headers.get("X-Refresh-Token");

      // Update the token
      dispatch(setToken(refreshToken));

      return res;
    },
    []
  );

  useEffect(() => {
    if (navigateTo !== "") {
      navigate(navigateTo);
      setNavigateTo("");
    }
  }, [navigateTo]);

  return fetchData;
}
