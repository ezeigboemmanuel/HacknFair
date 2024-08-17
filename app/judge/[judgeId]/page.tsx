"use client";

import { Button } from "@/components/ui/button";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useQuery } from "convex/react";

const FairPage = ({ params }: { params: { judgeId: string } }) => {
  const fair = useQuery(api.fairs.getSingleFair, {
    id: params.judgeId as Id<"fairs">,
  });
  return (
    <div>
      <div className="flex space-x-3">
        <Button>Edit</Button>
        <Button variant="destructive">Delete</Button>
      </div>

      {fair?.map((item) => (
        <div key={item._id}>
          <img src={item.imageUrl} />
          <p>{item.title}</p>
          <p>{item.subtitle}</p>
          <p>{item.deadline}</p>
          <p>{item.about}</p>
          <p>{item.requirements}</p>
          <p>{item.prices}</p>
          <p>{item.judgingCriteria}</p>
        </div>
      ))}
    </div>
  );
};

export default FairPage;
