"use client";

import { Button } from "@/components/ui/button";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useMutation, useQuery } from "convex/react";
import { redirect, useRouter } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Submissions from "@/components/submissions";

const FairPage = ({ params }: { params: { fairId: string } }) => {
  const user = useQuery(api.users.getCurrentUser);
  const fair = useQuery(api.fairs.getSingleFair, {
    id: params.fairId as Id<"fairs">,
  });
  
  if (user?._id !== fair?.map((item) => item.judgeId)[0]) {
    redirect(`/${params.fairId}`);
  }

  const deleteFair = useMutation(api.fairs.deleteFair);

  const onDelete = async () => {
    deleteFair({ id: params.fairId as Id<"fairs"> });
    router.back();
  };

  const router = useRouter();
  return (
    <div className="max-w-4xl mx-auto px-4">
      <div className="flex space-x-3 mt-5 justify-end">
        <Button
          onClick={() =>
            router.push(`/judge/${user?._id}/edit-fair/${params.fairId}`)
          }
        >
          Edit
        </Button>
        <Button onClick={onDelete} variant="destructive">
          Delete
        </Button>
      </div>
      <Tabs defaultValue="about">
        <TabsList>
          <TabsTrigger value="about">About</TabsTrigger>
          <TabsTrigger value="submissions">Submissions</TabsTrigger>
        </TabsList>
        <TabsContent value="about">
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
        </TabsContent>
        <TabsContent value="submissions">
          <Submissions />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FairPage;
