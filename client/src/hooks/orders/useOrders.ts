import { API_URL } from "@/app/constants";
import { useQuery, gql } from "@apollo/client";
import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const GET_DATA_ORDERS = gql`
  query GetData($page: Float!, $searchQuery: String!) {
    orders(page: $page, searchQuery: $searchQuery) {
      _id
      orderStatus
      paymentType
      createdAt
      isStopDesk
      cart {
        products {
          quantity
        }
        totalPrice
        subTotal
        note
      }
      client {
        firstName
        lastName
        address {
          willaya
          phone
          commun
        }
      }
    }
  }
`;

export const useOrders = (searchQuery: string) => {
  const [page, setPage] = useState(1);

  const {
    count,
    isLoadingCount,
    error: errorCount,
    refetch: refetchCount,
  } = useCount();

  const query = GET_DATA_ORDERS;

  const variables = { searchQuery, page };

  const {
    data: orders,
    loading: loadingOrders,
    error: errorOrders,
    refetch,
  } = useQuery(query, {
    variables,
    fetchPolicy: "network-only",
  });

  if (errorOrders || errorCount)
    toast.error("Error fetching products", {
      position: "bottom-right",
    });

  const isLoading = loadingOrders || isLoadingCount;

  const refetchOrders = (pagination: number) => {
    setPage(pagination);
    refetch();
    refetchCount();
  };

  return {
    refetch: refetchOrders,
    orders: orders?.orders,
    count,
    isLoading,
  };
};

const useCount = () => {
  const [count, setCount] = useState<number>(0);
  const [error, setError] = useState<number>(0);

  const [isLoadingCount, setIsLoadingCount] = useState<boolean>(true);

  async function fetch() {
    axios
      .get(`${API_URL}/order/count`, {
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
