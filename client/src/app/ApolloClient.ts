import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";
import { API_URL } from "./constants";

const httpLink = new HttpLink({
  uri: API_URL + "/graphql",
  credentials: 'include',
});

export const client = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
});
