"use client";
import FairCard from "@/components/fair-card";
import SearchBar from "@/components/SearchBar";
import { Button } from "@/components/ui/button";
import { api } from "@/convex/_generated/api";
import { useMutation, useQuery } from "convex/react";
import { marked } from "marked";
import Link from "next/link";
import { useEffect } from "react";
import SyncLoader from "react-spinners/SyncLoader";

interface HomeProps {
  searchParams: {
    search: string;
  };
}
export default function Home({ searchParams }: HomeProps) {
  const store = useMutation(api.users.storeUser);
  const user = useQuery(api.users.getCurrentUser);
  const fairs = useQuery(api.fairs.get, { search: searchParams.search });

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
    <main className="mx-4">
      {/* <Link href={`/judge/${user?._id}`}>
        <Button className="my-10">Become an organizer</Button>
      </Link> */}

      

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
