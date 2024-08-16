"use client";
import { api } from "@/convex/_generated/api";
import { useMutation } from "convex/react";
import { useEffect } from "react";

export default function Home() {
  const store = useMutation(api.users.storeUser);

  useEffect(() => {
    const storeUser = async () => {
      await store({});
    };

    storeUser();
  }, [store]);
  return <main>
    Home
  </main>;
}
