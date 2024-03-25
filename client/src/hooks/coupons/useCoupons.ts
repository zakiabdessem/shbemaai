import { API_URL } from "@/app/constants";
import { useQuery, gql } from "@apollo/client";
import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const GET_DATA_COUPONS = gql`
  query GetData {
    coupons {
      _id
      createdAt
      code
      discount
      expireDate
      isActive
    }
  }
`;

export const useCoupons = () => {
  const {
    count,
    isLoadingCount,
    error: errorCount,
    refetch: refetchCount,
  } = useCount();

  const query = GET_DATA_COUPONS;

  const {
    data: coupons,
    loading: loadingCoupons,
    error: errorOrders,
    refetch,
  } = useQuery(query, {
    fetchPolicy: "network-only",
  });

  if (errorOrders || errorCount)
    toast.error("Error fetching products", {
      position: "bottom-right",
    });

  const isLoading = loadingCoupons || isLoadingCount;

  const refetchCoupons = () => {
    refetch();
    refetchCount();
  };

  return {
    refetch: refetchCoupons,
    coupons: coupons?.coupons,
    count,
    isLoading,
  };
};

const useCount = () => {
  const [count, setCount] = useState<number>(0);
  const [error, setError] = useState<number>(0);

  const [isLoadingCount, setIsLoadingCount] = useState<boolean>(true);

  async function fetch() {
    await axios
      .get(`${API_URL}/coupon/count`, {
        withCredentials: true,
      })
      .then((response) => {
        setCount(response.data);
      })
      .catch((error) => setError(error))
      .finally(() => {
        setIsLoadingCount(false);
      });
  }

  useEffect(() => {
    fetch();
  }, []);

  return { count, isLoadingCount, error, refetch: fetch };
};
