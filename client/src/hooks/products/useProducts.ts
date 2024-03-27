import { useState, useEffect } from "react";
import { useQuery, gql } from "@apollo/client";
import axios from "axios";
import { toast } from "react-toastify";
import { API_URL } from "@/app/constants";
import useCategories from "../categories/useCategories";
import { Option } from "@/types/product";

export interface Product {
  _id: string;
  description: string;
  name: string;
  image: string | null | "";
  categories: {
    _id: string;
    name: string;
  }[];
  sku: string;
  price: number;
  quantity: number;
  inStock: boolean;
  business: number;
  unit: number;
  weight: number;
  options: Option[];
  track: boolean;
}

export interface Category {
  _id: string;
  name: string;
}

const GET_DATA_PRODUCTS = gql`
  query GetData($sortBy: String!, $page: String!) {
    products(sortBy: $sortBy, page: $page) {
      _id
      description
      name
      image
      categories {
        name
      }
      sku
      price
      quantity
      inStock
      track
    }
  }
`;

const GET_DATA_PRODUCTS_BY_CATEGORY = gql`
  query GetData(
    $selectedCategoryId: String!
    $sortBy: String!
    $page: String!
  ) {
    productsByCategory(
      categoryId: $selectedCategoryId
      sortBy: $sortBy
      page: $page
    ) {
      _id
      description
      name
      image
      categories {
        name
      }
      sku
      price
      quantity
      inStock
      track
    }
  }
`;

const GET_DATA_PRODUCT = gql`
  query GetData($productId: String!) {
    product(id: $productId) {
      _id
      name
      description
      image
      categories {
        _id
        name
      }
      business
      unit
      weight
      sku
      price
      quantity
      inStock
      options {
        name
        image
        track
        quantity
        inStock
        price
      }
      show
      promote
      track
    }
  }
`;

const useProduct = (productId: string) => {
  const query = GET_DATA_PRODUCT;
  // get page url query

  const { error: errorProduct, data: product } = useQuery(query, {
    variables: {
      productId,
    },
    fetchPolicy: "network-only",
  });

  if (errorProduct)
    toast.error("Error fetching product", {
      position: "bottom-right",
    });

  return product?.product;
};

const getSortValue = (sortBy: string) => {
  switch (sortBy) {
    case "date":
      return "date";
    case "stock":
      return "stock";
    default:
      return "all";
  }
};

const useProducts = ({
  sortBy,
  selectedCategoryId,
}: {
  sortBy: string;
  selectedCategoryId: string;
}) => {
  const { count, isLoadingCount, error: errorCount } = useCount("");

  const [page, setPage] = useState(1);

  const isCategorySort = Boolean(selectedCategoryId);

  const query = isCategorySort
    ? GET_DATA_PRODUCTS_BY_CATEGORY
    : GET_DATA_PRODUCTS;

  const variables = {
    sortBy: getSortValue(sortBy),
    page: page.toString(),
    ...(isCategorySort && { selectedCategoryId }),
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
  } = useCategories();

  if (errorProducts || errorCount || errorCategories)
    toast.error("Error fetching products", {
      position: "bottom-right",
    });

  const isLoading = loadingProducts || isLoadingCount || loadingCategories;

  const refetchProducts = (pagination: number) => {
    setPage(pagination);
    refetch();
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

export { useProducts, useProduct };
