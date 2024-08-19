"use client";

import { Button } from "@/components/ui/button";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useMutation, useQuery } from "convex/react";
import { useRouter } from "next/navigation";

const FairPage = ({ params }: { params: { fairId: string } }) => {
  const fair = useQuery(api.fairs.getSingleFair, {
    id: params.fairId as Id<"fairs">,
  });

  const deleteFair = useMutation(api.fairs.deleteFair)

  const onDelete = async () => {
    deleteFair({ id: params.fairId as Id<"fairs"> });
    router.back();
  };

  const router = useRouter();
  return (
    <div>
      <div className="flex space-x-3">
        <Button onClick={() => router.push(`/judge/edit-fair/${params.fairId}`)}>Edit</Button>
        <Button onClick={onDelete} variant="destructive">Delete</Button>
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
