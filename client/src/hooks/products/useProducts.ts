import { useState, useEffect } from "react";
import { useQuery, gql } from "@apollo/client";
import axios from "axios";
import { toast } from "react-toastify";
import { API_URL } from "@/app/constants";

export interface Product {
  _id: string;
  description: string;
  name: string;
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
  query GetData {
    products {
      _id
      description
      name
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
  query GetData($selectedCategoryId: String!) {
    productsByCategory(categoryId: $selectedCategoryId) {
      _id
      description
      name
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

  const isCategorySort = sortBy === "category" && selectedCategoryId;

  const {
    loading: loadingProducts,
    error: errorProducts,
    data: products,
    refetch,
  } = useQuery(
    isCategorySort ? GET_DATA_PRODUCTS_BY_CATEGORY : GET_DATA_PRODUCTS,
    {
      variables: isCategorySort ? { selectedCategoryId } : {},
      fetchPolicy: "network-only",
    }
  );

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
  console.log("selectedCategoryId", selectedCategoryId);

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
