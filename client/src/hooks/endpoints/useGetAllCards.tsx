import { APIResponse, IBusinessCard } from "../../types";
import useFetch from "../useFetch";

type Res = {
  cards: IBusinessCard[];
  page: number;
  maxPages: number;
};

export default function useGetAllCards(page: number = 1) {
  const { data, isLoading, error } = useFetch<Res>(`/api/all-cards?page=${page}`);

  let res: Res | null = null;

  if (data?.success === true) {
    res = data.message as Res;
  }

  return { res, isLoading, error };
}
