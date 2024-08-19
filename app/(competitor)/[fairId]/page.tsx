"use client";

import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useQuery } from "convex/react";
import { redirect, useRouter } from "next/navigation";
import React from "react";

const FairPage = ({ params }: { params: { fairId: Id<"fairs"> } }) => {
  const user = useQuery(api.users.getCurrentUser);
  const fair = useQuery(api.fairs.getSingleFair, {
    id: params.fairId,
    userId: user?._id
  });
  const router = useRouter()

  if(user?._id === fair?.map((item) => item.judgeId)[0]){
    redirect(`/judge/${fair?.map((item) => item.judgeId)[0]}/${params.fairId}`)
  }

  return <div>FairPage</div>;
};

export default FairPage;
