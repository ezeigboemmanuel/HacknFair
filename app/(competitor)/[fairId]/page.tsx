"use client";

import { Button } from "@/components/ui/button";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useMutation, useQuery } from "convex/react";
import Link from "next/link";
import { redirect, useRouter } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AboutFair from "@/components/about-fair";
import Submissions from "@/components/submissions";

const FairPage = ({ params }: { params: { fairId: Id<"fairs"> } }) => {
  const user = useQuery(api.users.getCurrentUser);
  const fair = useQuery(api.fairs.getSingleFair, {
    id: params.fairId,
  });
  const router = useRouter();

  const submissions = useQuery(api.submissions.get);

  // if (user?._id === fair?.map((item) => item.judgeId)[0]) {
  //   redirect(`/judge/${fair?.map((item) => item.judgeId)[0]}/${params.fairId}`);
  // }
  const deleteFair = useMutation(api.fairs.deleteFair);
  const onDelete = async () => {
    deleteFair({ id: params.fairId as Id<"fairs"> });
    router.back();
  };

  return (
    <div className="max-w-4xl mx-auto px-4">
      {user?._id == fair?.map((item) => item.judgeId) ? (
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
      ) : (
        <div className="flex space-x-3 mt-5 justify-end">
          {submissions
            ?.map((submission) => submission.userId)
            .includes(user!._id) ? (
            <Button disabled>Already Submitted</Button>
          ) : (
            <Button
              disabled={submissions
                ?.map((submission) => submission.userId)
                .includes(user!._id)}
              onClick={() => router.push(`/${params.fairId}/submit`)}
            >
              Make submission
            </Button>
          )}
        </div>
      )}
      
      <Tabs defaultValue="about">
        <TabsList>
          <TabsTrigger value="about">About</TabsTrigger>
          <TabsTrigger value="submissions">Submissions</TabsTrigger>
        </TabsList>
        <TabsContent value="about">
          {fair?.map((item) => (
            <AboutFair
              key={item._id}
              title={item.title}
              subtitle={item.subtitle}
              about={item.about}
              deadline={item.deadline}
              imageUrl={item.imageUrl}
              judgingCriteria={item.judgingCriteria}
              prices={item.prices}
              requirements={item.requirements}
              name={item.judge?.name}
            />
          ))}
        </TabsContent>
        <TabsContent value="submissions">
          {fair?.map((item) => item._id) ==
          submissions?.map((submission) => submission.fairId)[0] ? (
            <Submissions
              fairId={fair?.map((item) => item._id)[0] as Id<"fairs">}
            />
          ) : (
            <div>No submission yet</div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FairPage;
