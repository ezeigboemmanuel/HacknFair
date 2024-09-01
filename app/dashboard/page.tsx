"use client";

import SubmissionCard from "@/components/submission-card";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useQuery } from "convex/react";
import Link from "next/link";
import React from "react";
import SyncLoader from "react-spinners/SyncLoader";

const page = () => {
  // const user = useQuery(api.users.getCurrentUser);
  // const submissions = useQuery(api.submissions.get);
  // const comments = useQuery(api.comments.get);
  // if (!user) {
  //   return <div>loading...</div>;
  // }

  // if (submissions == undefined) {
  //   return (
  //     <div className="h-[100vh] w-full flex justify-center items-center">
  //       <SyncLoader />
  //     </div>
  //   );
  // }

  // const fairs = useQuery(api.fairs.getFairsByUser, { id: user._id });
  // console.log(fairs?.map((item) => item._id) as Id<"fairs">[]);

  return (
    <div className="mx-4 md:mx-10 mt-5">
      <h1 className="text-green text-2xl md:text-3xl font-bold">Dashboard</h1>

      <Tabs defaultValue="overview" className="mt-5 mb-10">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="submissions">Submissions</TabsTrigger>
          <TabsTrigger value="created-fairs">Created Fairs</TabsTrigger>
        </TabsList>
        <TabsContent value="overview">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-3 mt-2">
            <div className="bg-white border-[#D7D9E4] border rounded-lg shadow-md p-6">
              <h3 className="text-[#0A0F29] text-[16px] font-[600] text-left">
                Total Submissions
              </h3>
              <div className="flex flex-row justify-between items-center mt-2">
                <h3 className="text-[#0A0F29] text-[24px] text-center font-[600]">
                  677
                </h3>
              </div>
            </div>
            <div className="bg-white border-[#D7D9E4] border rounded-lg shadow-md p-6">
              <h3 className="text-[#0A0F29] text-[16px] font-[600] text-left">
                Total Fairs Created
              </h3>
              <div className="flex flex-row justify-between items-center mt-2">
                <h3 className="text-[#0A0F29] text-[24px] text-center font-[600]">
                  102
                </h3>
              </div>
            </div>
          </div>
        </TabsContent>
        <TabsContent value="submissions">
          {/* {submissions?.length > 0 ? (
            submissions.map((submission) => (
              <SubmissionCard
                key={submission._id}
                title={submission.title}
                about={submission.about}
                email={submission.email}
                imageUrls={submission.imageUrls}
                link={`${fairs?.map((item) => item._id) as Id<"fairs">[]}/${submission._id}`}
                userId={submission.userId}
                creatorName={submission.creator?.name}
                upvotes={submission.upvotes}
                downvotes={submission.downvotes}
                votes={submission.votes}
                commentLength={
                  comments
                    ?.map((comment) =>
                      submission._id.includes(comment.submissionId)
                    )
                    .filter((item) => item === true).length
                }
                winner={submission.winner}
              />
            ))
          ) : (
            <div>No submission yet</div>
          )} */}

          submissios
        </TabsContent>
        <TabsContent value="created-fairs">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-5">
            {/* {fairs?.map((fair) => (
              <Link key={fair._id} href={`/${fair._id}`}>
                <div className="mx-auto max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 hover:shadow-lg">
                  <AspectRatio ratio={16 / 12}>
                    <img
                      className="rounded-t-lg object-cover w-full h-full"
                      src={fair.imageUrl}
                      alt=""
                    />
                  </AspectRatio>
                  <div className="p-5">
                    <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                      {fair.title}
                    </h5>
                    <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
                      {fair.subtitle}
                    </p>
                    <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
                      Deadline: {fair.deadline}
                    </p>
                  </div>
                </div>
              </Link>
            ))} */}
            Dggg
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default page;
