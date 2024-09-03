"use client";

import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const JudgePage = () => {
  const user = useQuery(api.users.getCurrentUser);
  const router = useRouter();
  setTimeout(() => {
    router.push(`/dashboard`);
  }, 4000);
  return <div></div>;
};

export default JudgePage;
