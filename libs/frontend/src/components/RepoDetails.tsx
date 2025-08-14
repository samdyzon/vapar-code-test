import React from "react";
import type { LoaderFunctionArgs } from "react-router-dom";
import type { QueryClient } from "@tanstack/react-query";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { Link, useLoaderData } from "react-router-dom";
import { Error } from "./Error";

export const getRepoDetails = async ({ owner, repo }) => {
  let url = `http://localhost:8000/api/repo/${owner}/${repo}`;
  let response = await fetch(url);
  return await response.json();
};

export const repoDetailQuery = ({ params }) =>
  queryOptions({
    queryKey: ["repos", "detail", params.owner, params.repo],
    queryFn: async () => {
      const repo = await getRepoDetails(params);

      if (!repo) {
        throw new Response("", {
          status: 404,
          statusText: "Not Found",
        });
      }
      return repo;
    },
  });

export const loader =
  (queryClient: QueryClient) =>
  async ({ params }: LoaderFunctionArgs) => {
    if (!params.owner) {
      throw new Error("No owner provided");
    }
    if (!params.repo) {
      throw new Error("No repo provided");
    }
    await queryClient.ensureQueryData(repoDetailQuery({ params }));
    return { owner: params.owner, repo: params.repo };
  };

export const RepoDetails = () => {
  const { owner, repo } = useLoaderData() as Awaited<
    ReturnType<ReturnType<typeof loader>>
  >;

  const { data } = useSuspenseQuery(
    repoDetailQuery({ params: { owner, repo } })
  );

  return (
    <>
      {data.error ? (
        <Error error={data.error} />
      ) : (
        <div className="p-4 flex flex-col bg-white">
          <div className="pb-2 flex flex-wrap justify-between items-center gap-2 border-b border-dashed border-gray-200">
            <h2 className="font-medium text-gray-800">Repository Details</h2>

            <Link
              to="/"
              className="py-1.5 px-2.5 flex items-center justify-center gap-x-1.5 border border-gray-200 text-gray-800 text-[13px] rounded-lg hover:bg-indigo-50 hover:border-indigo-100 hover:text-indigo-700 focus:outline-none focus:bg-indigo-50 focus:border-indigo-100 focus:text-indigo-700 "
            >
              <svg
                className="shrink-0 size-3.5"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8"></path>
                <path d="M21 3v5h-5"></path>
              </svg>
              Back to Search
            </Link>
          </div>

          <div className="flex flex-col bg-white pb-4 last:pb-0 last:border-b-0 border-b border-gray-200">
            <div className="pt-4 flex flex-col md:flex-row gap-5">
              <div className="relative aspect-4/2 md:aspect-4/3 w-full md:max-w-80 bg-gray-100 rounded-lg">
                <img
                  className="absolute inset-0 size-full object-cover object-center rounded-lg"
                  src="https://images.unsplash.com/photo-1737625773603-3f0acdb5bb3f?q=80&w=480&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                  alt="Post Image"
                />
              </div>

              <div className="grow">
                <div className="h-full flex flex-col">
                  <p className="text-sm text-gray-500 ">Repo Name:</p>
                  <h3 className="font-medium text-gray-800 ">
                    {data.repo.full_name}
                  </h3>

                  <div className="mt-4 grid grid-cols-2 xl:grid-cols-3 gap-y-4 gap-x-2">
                    <div className="flex flex-col gap-y-1">
                      <span className="text-[13px] text-gray-500 ">Stars:</span>

                      <div className="flex items-center gap-x-1.5">
                        <svg
                          className="shrink-0 size-4 text-gray-800"
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        >
                          <path d="M10 14.66v1.626a2 2 0 0 1-.976 1.696A5 5 0 0 0 7 21.978" />
                          <path d="M14 14.66v1.626a2 2 0 0 0 .976 1.696A5 5 0 0 1 17 21.978" />
                          <path d="M18 9h1.5a1 1 0 0 0 0-5H18" />
                          <path d="M4 22h16" />
                          <path d="M6 9a6 6 0 0 0 12 0V3a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1z" />
                          <path d="M6 9H4.5a1 1 0 0 1 0-5H6" />
                        </svg>

                        <div className="flex items-center gap-2">
                          <span className="font-medium text-sm text-gray-800">
                            {data.repo.stargazers_count}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col gap-y-1">
                      <span className="text-[13px] text-gray-500">
                        Forks Count:
                      </span>

                      <div className="flex items-center gap-x-1.5">
                        <svg
                          className="shrink-0 size-4 text-gray-800"
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        >
                          <path d="M8 2v4" />
                          <path d="M16 2v4" />
                          <path d="M21 17V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h11Z" />
                          <path d="M3 10h18" />
                          <path d="M15 22v-4a2 2 0 0 1 2-2h4" />
                        </svg>

                        <span className="font-medium text-sm text-gray-800">
                          {data.repo.forks_count}
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-col gap-y-1">
                      <span className="text-[13px] text-gray-500">
                        Open Issues:
                      </span>

                      <div className="flex items-center gap-x-1.5">
                        <svg
                          className="shrink-0 size-4 text-gray-800"
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        >
                          <path d="M11.5 15H7a4 4 0 0 0-4 4v2" />
                          <path d="M21.378 16.626a1 1 0 0 0-3.004-3.004l-4.01 4.012a2 2 0 0 0-.506.854l-.837 2.87a.5.5 0 0 0 .62.62l2.87-.837a2 2 0 0 0 .854-.506z" />
                          <circle cx="10" cy="7" r="4" />
                        </svg>

                        <span className="font-medium text-sm text-gray-800">
                          {data.repo.open_issues_count}
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-col gap-y-1">
                      <span className="text-[13px] text-gray-500">
                        Language:
                      </span>

                      <div className="flex items-center gap-x-1.5">
                        <svg
                          className="shrink-0 size-4 text-gray-800"
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        >
                          <rect width="7" height="7" x="3" y="3" rx="1" />
                          <rect width="7" height="7" x="14" y="3" rx="1" />
                          <rect width="7" height="7" x="14" y="14" rx="1" />
                          <rect width="7" height="7" x="3" y="14" rx="1" />
                        </svg>

                        <span className="font-medium text-sm text-gray-800">
                          {data.repo.language}
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-col gap-y-1">
                      <span className="text-[13px] text-gray-500">
                        Description:
                      </span>

                      <div className="flex items-center gap-x-1.5">
                        {data.repo.description}
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 xl:mt-auto pt-4 border-t border-gray-200 dark:border-neutral-700">
                    <div className="flex flex-wrap justify-between items-center gap-1.5">
                      <div>
                        <a
                          className="inline-flex items-center gap-x-0.5 text-[13px] text-indigo-700 underline underline-offset-2 hover:decoration-2 focus:outline-hidden focus:decoration-2 disabled:opacity-50 disabled:pointer-events-none dark:text-indigo-400"
                          href={data.repo.html_url}
                          target="_blank"
                        >
                          View Repo on GitHub
                          <svg
                            className="shrink-0 size-4"
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="2"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          >
                            <path d="m9 18 6-6-6-6"></path>
                          </svg>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
