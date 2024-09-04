"use client";
import FairCard from "@/components/fair-card";
import SearchBar from "@/components/SearchBar";
import { Button } from "@/components/ui/button";
import { api } from "@/convex/_generated/api";
import { useMutation, useQuery } from "convex/react";
import { marked } from "marked";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import SyncLoader from "react-spinners/SyncLoader";

export default function Home() {
  const searchParams = useSearchParams();
  const search = searchParams.get("search");
  const searchQuery = search || "";
  const store = useMutation(api.users.storeUser);
  const user = useQuery(api.users.getCurrentUser);
  const fairs = useQuery(api.fairs.get, { search: searchQuery });

  console.log("search: ", searchQuery)
  useEffect(() => {
    const storeUser = async () => {
      await store({});
    };

    storeUser();
  }, [store]);

  if (fairs == undefined) {
    return (
      <div className="h-[100vh] w-full flex justify-center items-center">
        <SyncLoader />
      </div>
    );
  }

  return (
    <main className="mx-4 mb-10 mt-5">
      <h1 className="text-green text-2xl md:text-3xl font-bold">
        Recent fairs
      </h1>

      <br />
      {fairs?.length === 0 && <p>No fair found.</p>}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-5 gap-y-5 w-full">
        {fairs?.map((fair) => (
          <div key={fair._id}>
            <FairCard
              link={fair._id}
              imageUrl={fair.imageUrl}
              title={fair.title}
              subtitle={fair.subtitle}
              deadline={fair.deadline}
              userId={user?._id}
              judgeId={fair.judgeId}
            />
          </div>
        ))}
      </div>
    </main>
  );
}
