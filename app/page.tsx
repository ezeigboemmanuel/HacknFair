"use client";
import FairCard from "@/components/fair-card";
import SearchBar from "@/components/SearchBar";
import { Button } from "@/components/ui/button";
import { api } from "@/convex/_generated/api";
import { useMutation, useQuery } from "convex/react";
import { marked } from "marked";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import SyncLoader from "react-spinners/SyncLoader";
import EmptyImg from "@/assets/empty.svg";

export default function Home() {
  const searchParams = useSearchParams();
  const search = searchParams.get("search");
  const searchQuery = search || "";
  const store = useMutation(api.users.storeUser);
  const user = useQuery(api.users.getCurrentUser);
  const fairs = useQuery(api.fairs.get, { search: searchQuery });
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
    <main className="mx-4 mb-10 mt-5 max-w-[1200px] lg:mx-auto">
      {fairs?.length !== 0 && (
        <h1 className="text-green text-2xl md:text-3xl font-bold">
          Recent fairs
        </h1>
      )}

      <br />
      {fairs?.length === 0 && (
        <div className="w-full flex justify-center items-center">
          <div className="flex flex-col justify-center items-center mt-3">
            <Image src={EmptyImg} alt="empty" className="w-40 h-40" />
            <p className="text-xl font-semibold mt-3">No fair found</p>
            <Link href="/">
              <p className="text-green">Go to home</p>
            </Link>
          </div>
        </div>
      )}
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
