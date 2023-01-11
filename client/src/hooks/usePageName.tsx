import React from "react";
import { useDispatch } from "react-redux";
import { setPageName } from "../pageSlice";

export default function usePageName(pageName: string) {
  const dispatch = useDispatch();
  dispatch(setPageName(pageName));

  return pageName;
}
