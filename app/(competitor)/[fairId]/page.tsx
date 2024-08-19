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
  });
  const router = useRouter();

  if (user?._id === fair?.map((item) => item.judgeId)[0]) {
    redirect(`/judge/${fair?.map((item) => item.judgeId)[0]}/${params.fairId}`);
  }

  return (
    <div className="max-w-4xl mx-auto px-4">
      {fair?.map((item) => (
        <div key={item._id} className="mt-5">
          <h1 className="font-bold break-normal text-3xl md:text-5xl">
            {item.title}
          </h1>
          <h3 className="italic text-gray-500">{item.subtitle}</h3>
          <p className="mt-2 mb-2 text-sm">Deadline: {item.deadline}</p>
          <img src={item.imageUrl} />
          <h2 className="my-6 font-semibold text-xl">About</h2>
          <p>{item.about}</p>
          <h2 className="my-6 font-semibold text-xl">Requirements</h2>
          <p>{item.requirements}</p>
          <h2 className="my-6 font-semibold text-xl">Prices</h2>
          <p>{item.prices}</p>
          <h2 className="my-6 font-semibold text-xl">Judging Criteria</h2>
          <p>{item.judgingCriteria}</p>
        </div>
      ))}
    </div>
  );
};

export default FairPage;
