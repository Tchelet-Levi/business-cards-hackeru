import { useDispatch } from "react-redux";
import { IUserInfo } from "../../types";
import useFetch from "../useFetch";
import { setUser } from "../../userSlice";
import { useEffect } from "react";

export default function useGetUserInfo() {
  // Redux
  const dispatch = useDispatch();

  const { data, isLoading, error } = useFetch<IUserInfo>("/api/user");
  let user = data?.message as IUserInfo;

  useEffect(() => {
    if (data?.success === true) {
      dispatch(setUser(user));
    }
  }, [data, isLoading, error]);

  return { user, isLoading, error };
}
