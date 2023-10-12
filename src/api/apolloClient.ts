import { createClient } from "graphql-ws";
import { ApolloClient, HttpLink, InMemoryCache, split } from "@apollo/client/core";
import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { getMainDefinition } from "@apollo/client/utilities";

const httpLink = new HttpLink({
  uri: "https://api.timerise.io/v1",
});

const wsLink = new GraphQLWsLink(
  createClient({
    url: "wss://api.timerise.io/v1",
    connectionParams: {},
  }),
);

const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return definition.kind === "OperationDefinition" && definition.operation === "subscription";
  },
  wsLink,
  httpLink,
);

export const apolloClient = new ApolloClient({
  link: splitLink,
  cache: new InMemoryCache(),
});
