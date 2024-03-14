import { useState, useEffect } from "react";
import { useQuery, gql } from "@apollo/client";
import axios from "axios";
import { toast } from "react-toastify";
import { API_URL } from "@/app/constants";

export interface Product {
  _id: string;
  description: string;
  name: string;
  image: string;
  category: {
    name: string;
  };
  sku: number;
  price: number;
  quantity: number;
  inStock: boolean;
}

export interface Category {
  _id: string;
  name: string;
}

const GET_DATA_PRODUCTS = gql`
  query GetData($sortBy: String!) {
    products(sortBy: $sortBy) {
      _id
      description
      name
      image
      category {
        name
      }
      sku
      price
      quantity
      inStock
    }
  }
`;

const GET_DATA_PRODUCTS_BY_CATEGORY = gql`
  query GetData($selectedCategoryId: String!, $sortBy: String!) {
    productsByCategory(categoryId: $selectedCategoryId, sortBy: $sortBy) {
      _id
      description
      name
      image
      category {
        name
      }
      sku
      price
      quantity
      inStock
    }
  }
`;

const GET_DATA_CATEGORIES = gql`
  {
    categories {
      _id
      name
    }
  }
`;

const useProducts = ({
  sortBy,
  selectedCategoryId,
}: {
  sortBy: string;
  selectedCategoryId: string;
}) => {
  const {
    count,
    isLoadingCount,
    error: errorCount,
    refetch: refetchCount,
  } = useCount(selectedCategoryId || "");

  const isCategorySort = Boolean(selectedCategoryId);
  const isDateSort = sortBy === "date";
  const isStockSort = sortBy === "stock";

  const query = isCategorySort
    ? GET_DATA_PRODUCTS_BY_CATEGORY
    : GET_DATA_PRODUCTS;
  const variables = isCategorySort
    ? {
        selectedCategoryId,
        sortBy: isDateSort ? "date" : isStockSort ? "stock" : "all",
      }
    : {
        sortBy: isDateSort ? "date" : isStockSort ? "stock" : "all",
      };

  const {
    loading: loadingProducts,
    error: errorProducts,
    data: products,
    refetch,
  } = useQuery(query, {
    variables,
    fetchPolicy: "network-only",
  });

  const {
    loading: loadingCategories,
    error: errorCategories,
    data: categories,
  } = useQuery(GET_DATA_CATEGORIES);

  if (errorProducts || errorCount || errorCategories)
    toast.error("Error fetching products", {
      position: "bottom-right",
    });

  const isLoading = loadingProducts || isLoadingCount || loadingCategories;

  const refetchProducts = () => {
    refetch();
    refetchCount();
  };

  return {
    refetch: refetchProducts,
    products: products?.products || products?.productsByCategory,
    categories: categories?.categories,
    count,
    isLoading,
  };
};

const useCount = (selectedCategoryId: string) => {
  const [count, setCount] = useState<number>(0);
  const [error, setError] = useState<number>(0);

  const [isLoadingCount, setIsLoadingCount] = useState<boolean>(true);

  async function fetch() {
    axios
      .post(
        `${API_URL}/product/count`,
        {
          selectedCategoryId,
        },
        {
          withCredentials: true,
        }
      )
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

export default useProducts;
