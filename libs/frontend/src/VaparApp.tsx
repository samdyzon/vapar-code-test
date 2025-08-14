import React, { useState } from "react";
import { createHashRouter, RouterProvider } from "react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { RepoSearch } from "./components/RepoSearch";
import { RepoDetails, loader as repoLoader } from "./components/RepoDetails";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 10,
    },
  },
});

let router = createHashRouter([
  {
    path: "/",
    Component: RepoSearch,
  },
  {
    path: "/repos/:owner/:repo",
    Component: RepoDetails,
    loader: repoLoader(queryClient),
  },
]);

export const AppWrapper = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
};
