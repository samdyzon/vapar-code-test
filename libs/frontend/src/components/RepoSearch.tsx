import React, { useState } from "react";
import {
  QueryClient,
  QueryClientProvider,
  QueryErrorResetBoundary,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useDebouncedCallback } from "use-debounce";
import { Link } from "react-router-dom";

export const searchRepos = async (query) => {
  let url = `http://localhost:8000/api/repos?query=${encodeURIComponent(
    query
  )}`;
  let response = await fetch(url);
  return await response.json();
};

export const RepoSearch = () => {
  const [query, setQuery] = useState<string>("");

  const debounced = useDebouncedCallback((value) => {
    setQuery(value);
  }, 500);

  const { data, isLoading } = useQuery({
    queryKey: [`search/${query}`],
    queryFn: async (arg) => {
      return searchRepos(query);
    },
  });

  return (
    <>
      <div className="max-w-6xl py-10 px-4 sm:px-6 lg:px-8 lg:py-16 mx-auto">
        <div className="max-w-xl text-center mx-auto">
          <div className="mb-5">
            <h2 className="text-2xl font-bold md:text-3xl md:leading-tight ">
              Search for a Repo in GitHub
            </h2>
          </div>

          <div className="mt-5 lg:mt-8 flex flex-col items-center gap-2 sm:flex-row sm:gap-3">
            <div className="w-full">
              <input
                type="text"
                className="py-2.5 sm:py-3 px-4 block w-full border-gray-400 border-1 rounded-lg sm:text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none "
                placeholder="Enter A Query"
                onChange={(e) => debounced(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[85rem] px-4 py-10 sm:px-6 lg:px-8 lg:py-14 mx-auto">
        {isLoading ? (
          <p>Loading...</p>
        ) : (
          <div className="flex flex-col">
            <div className="-m-1.5 overflow-x-auto">
              <div className="p-1.5 min-w-full inline-block align-middle">
                <div className="bg-white border border-gray-200 rounded-xl shadow-2xs overflow-hidden ">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50 ">
                      <tr>
                        <th
                          scope="col"
                          className="px-6 py-3 text-start whitespace-nowrap"
                        >
                          <span className="text-xs font-semibold uppercase text-gray-800 ">
                            #
                          </span>
                        </th>

                        <th
                          scope="col"
                          className="px-6 py-3 text-start whitespace-nowrap min-w-64"
                        >
                          <span className="text-xs font-semibold uppercase text-gray-800">
                            Repository
                          </span>
                        </th>

                        <th
                          scope="col"
                          className="px-6 py-3 text-start whitespace-nowrap"
                        >
                          <span className="text-xs font-semibold uppercase text-gray-800">
                            Description
                          </span>
                        </th>

                        <th
                          scope="col"
                          className="px-6 py-3 text-start whitespace-nowrap"
                        >
                          <span className="text-xs font-semibold uppercase text-gray-800">
                            Stargazers
                          </span>
                        </th>

                        <th
                          scope="col"
                          className="px-6 py-3 text-start whitespace-nowrap"
                        >
                          <span className="text-xs font-semibold uppercase text-gray-800">
                            Forks
                          </span>
                        </th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-gray-200">
                      {data && (
                        <>
                          {data.results ? (
                            data.results.map((result, index) => {
                              const n = index + 1;
                              return (
                                <tr key={result.name}>
                                  <td className="size-px whitespace-nowrap px-6 py-3">
                                    <span className="text-sm text-gray-800 ">
                                      {n}
                                    </span>
                                  </td>
                                  <td className="size-px whitespace-nowrap px-6 py-3">
                                    <div className="flex items-center gap-x-3">
                                      <Link
                                        to={`/repos/${result.owner}/${result.name}`}
                                      >
                                        <span className="font-semibold text-sm mr-2 text-gray-800">
                                          {result.name}
                                        </span>
                                        <span className="text-xs text-gray-500 ">
                                          {result.full_name}
                                        </span>
                                      </Link>
                                    </div>
                                  </td>
                                  <td className="size-px whitespace-nowrap max-w-[24rem] truncate px-6 py-3">
                                    <span className="text-sm text-gray-800">
                                      {result.description}
                                    </span>
                                  </td>

                                  <td className="size-px whitespace-nowrap px-6 py-3">
                                    <span className="text-sm text-gray-800 ">
                                      {result.stargazers_count}
                                    </span>
                                  </td>
                                  <td className="size-px whitespace-nowrap px-6 py-3">
                                    <span className="text-sm text-gray-800 ">
                                      {result.forks_count}
                                    </span>
                                  </td>
                                </tr>
                              );
                            })
                          ) : (
                            <tr>
                              <td className="size-px whitespace-nowrap px-6 py-3" colSpan={5}>{data.error}</td>
                            </tr>
                          )}
                        </>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};
