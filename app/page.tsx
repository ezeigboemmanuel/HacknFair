"use client";
import { Button } from "@/components/ui/button";
import { api } from "@/convex/_generated/api";
import { useMutation, useQuery } from "convex/react";
import Link from "next/link";
import { useEffect } from "react";

export default function Home() {
  const store = useMutation(api.users.storeUser);

  useEffect(() => {
    const storeUser = async () => {
      await store({});
    };

    storeUser();
  }, [store]);
  return (
    <main className="mx-4">
      <Link href="/judge">
        <Button className="my-10">Become an organizer</Button>
      </Link>
      <br />
      Home
    </main>
  );
}
