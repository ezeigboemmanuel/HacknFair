"use client";

import FairCard from "@/components/fair-card";
import SubmissionCard from "@/components/submission-card";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useQuery } from "convex/react";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import SyncLoader from "react-spinners/SyncLoader";
import EmptyImg from "@/assets/empty.svg";

const page = () => {
  const user = useQuery(api.users.getCurrentUser);
  const comments = useQuery(api.comments.get);

  const submissions = useQuery(api.submissions.getSubmissionsByUser, {
    userId: user?._id,
  });

  const fairs = useQuery(api.fairs.getFairsByUser, { id: user?._id });
  if (submissions == undefined) {
    return (
      <div className="h-[100vh] w-full flex justify-center items-center">
        <SyncLoader />
      </div>
    );
  }

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
                  {submissions ? submissions.length : "0"}
                </h3>
              </div>
            </div>
            <div className="bg-white border-[#D7D9E4] border rounded-lg shadow-md p-6">
              <h3 className="text-[#0A0F29] text-[16px] font-[600] text-left">
                Total Fairs Created
              </h3>
              <div className="flex flex-row justify-between items-center mt-2">
                <h3 className="text-[#0A0F29] text-[24px] text-center font-[600]">
                  {fairs?.length ? fairs.length : "0"}
                </h3>
              </div>
            </div>
          </div>
        </TabsContent>
        <TabsContent value="submissions">
          <div className="w-full">
            {submissions.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-5 gap-x-4">
                {" "}
                {submissions.map((submission) => (
                  <SubmissionCard
                    key={submission._id}
                    title={submission.title}
                    about={submission.about}
                    email={submission.email}
                    imageUrls={submission.imageUrls}
                    link={`${submission.fairId}/${submission._id}`}
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
                ))}
              </div>
            ) : (
              <div className="w-full flex justify-center items-center">
                <div className="flex flex-col justify-center items-center mt-3">
                  <Image src={EmptyImg} alt="empty" className="w-40 h-40" />
                  <p className="text-xl font-semibold mt-3">
                    You don't have any submission
                  </p>
                  <Link href="/fairs">
                    <p className="text-green">Go to fairs</p>
                  </Link>
                </div>
              </div>
            )}
          </div>
        </TabsContent>
        <TabsContent value="created-fairs">
          {fairs?.length === 0 && (
            <div className="w-full flex justify-center items-center">
              <div className="flex flex-col justify-center items-center mt-3">
                <Image src={EmptyImg} alt="empty" className="w-40 h-40" />
                <p className="text-xl font-semibold mt-3">
                  You don't have any fair created
                </p>
                <Link href={`/judge/${user?._id}/create-fair`}>
                  <p className="text-green">Create fair</p>
                </Link>
              </div>
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-5 gap-y-5 w-full">
            {fairs?.map((fair) => (
              <div key={fair._id}>
                <FairCard
                  link={fair._id}
                  imageUrl={fair.imageUrl}
                  title={fair.title}
                  subtitle={fair.subtitle}
                  deadline={fair.deadline}
                  userId={user?._id}
                  judgeId={fair.judgeId}
                />
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default page;
