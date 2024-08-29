"use state";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import queryString from "query-string";

const SearchBar = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const search = searchParams.get("search");
  const [value, setValue] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const url = queryString.stringifyUrl(
      {
        url: pathname,
        query: {
          search: value,
        },
      },
      { skipEmptyString: true, skipNull: true }
    );

    router.push(url);
  };

  const clearSearch = () => {
    const url = queryString.stringifyUrl(
      {
        url: pathname,
        query: {
          search: "",
        },
      },
      { skipEmptyString: true, skipNull: true }
    );

    router.push(url);
  };
  return (
    <div className="w-full mx-auto pl-8">
      <form className="w-full" onSubmit={handleSubmit}>
        <div className="w-full flex justify-center items-center space-x-2">
          <div className="relative w-full">
            <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
              <svg
                className="w-4 h-4 text-gray-500 dark:text-gray-400"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 20 20"
              >
                <path
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                />
              </svg>
            </div>
            <input
              type="search"
              id="default-search"
              className="block w-full p-3 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
              placeholder="Search Fairs, Hackathons..."
              onChange={handleChange}
              value={value}
              required
            />
          </div>
          <button
            type="submit"
            className="text-white bg-green hover:bg-[#48dd3a] font-medium rounded-lg text-sm px-4 py-3"
          >
            Search
          </button>
          {search && <p onClick={clearSearch} className="cursor-pointer hover:underline text-red-500 text-sm min-w-[100px]">Clear search</p>}
        </div>
      </form>
    </div>
  );
};

export default SearchBar;
