import { gql, useQuery } from "@apollo/client";

const GET_DATA_CATEGORIES = gql`
  {
    categories {
      _id
      name
    }
  }
`;

const useCategories = () => {
  const { data, error, loading } = useQuery(GET_DATA_CATEGORIES);
  return { data: data?.categories, error, loading };
};
export default useCategories;
