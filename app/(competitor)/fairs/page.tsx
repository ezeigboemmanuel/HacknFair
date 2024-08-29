"use client";
import FairCard from "@/components/fair-card";
import { Button } from "@/components/ui/button";
import { api } from "@/convex/_generated/api";
import { useMutation, useQuery } from "convex/react";
import { marked } from "marked";
import Link from "next/link";
import { useEffect } from "react";
import SyncLoader from "react-spinners/SyncLoader";

export default function FairPage({
  searchParams,
}: {
  searchParams: { search: string };
}) {
  const user = useQuery(api.users.getCurrentUser);
  const fairs = useQuery(api.fairs.get, { search: searchParams.search });
  console.log(searchParams.search);
  if (fairs == undefined) {
    return (
      <div className="h-[100vh] w-full flex justify-center items-center">
        <SyncLoader />
      </div>
    );
  }

  return (
    <main className="mx-4">
      {fairs?.length === 0 && <p>No fair found.</p>}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-5 gap-x-5">
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
