"use client";

import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { useRouter } from "next/router";
import { useEffect } from "react";

const JudgePage = () => {
  const router = useRouter();
  const user = useQuery(api.users.getCurrentUser);
  useEffect(() => {
    router.push(`/judge/${user?._id}`);
  }, []);
  return <div></div>;
};

export default JudgePage;
