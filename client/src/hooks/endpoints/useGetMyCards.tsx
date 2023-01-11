import { useEffect, useState } from "react";
import { APIResponse, IBusinessCard } from "../../types";
import useFetch from "../useFetch";
import useFetchBasic from "../useFetchBasic";
import React from "react";

export default function useGetMyCards() {
  const [data, setData] = useState<{
    success: boolean;
    message: string | IBusinessCard[];
  } | null>(null);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<any>();
  const [cards, setCards] = useState<IBusinessCard[] | null>(null);

  const fetchWithToken = useFetchBasic();

  useEffect(() => {
    updateCallback();
  }, []);

  const updateCallback = React.useCallback(update, []);

  async function update() {
    try {
      setIsLoading(true);
      const res = await fetchWithToken(`/api/my-cards`);
      const data = await res.json();

      if (data?.success === true) {
        setCards(data.message as IBusinessCard[]);
      } else {
        setError(data.message);
      }

      setIsLoading(false);
    } catch (e) {
      setIsLoading(false);
      setError(e);
    }
  }

  return { cards, isLoading, error, update };
}
