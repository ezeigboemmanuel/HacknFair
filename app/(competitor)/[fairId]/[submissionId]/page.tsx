"use client";

import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useMutation, useQuery } from "convex/react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowBigDown, ArrowBigUp, MessageSquare } from "lucide-react";
import Comments from "@/components/comments";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import { useState } from "react";
import Submissions from "@/components/submissions";

const page = ({ params }: { params: { submissionId: Id<"submissions"> } }) => {
  const router = useRouter();
  const singleSubmission = useQuery(api.submissions.getSingleSubmission, {
    id: params.submissionId,
  });
  const fairParam = useParams();
  const fair = useQuery(api.fairs.getSingleFair, {
    id: fairParam.fairId as Id<"fairs">,
  });
  const user = useQuery(api.users.getCurrentUser);
  const deleteFair = useMutation(api.submissions.deleteSubmission);
  const onDelete = async () => {
    deleteFair({ id: params.submissionId as Id<"submissions"> });
    toast.success("Project deleted successfully.");
    router.back();
  };
  const upvote = useMutation(api.submissions.upvoteSubmission);
  const downvote = useMutation(api.submissions.downvoteSubmission);
  const makeWinner = useMutation(api.submissions.makeWinner);
  const removeWinner = useMutation(api.submissions.removeWinner);

  if (!user) {
    return;
  }

  const handleUpvote = async () => {
    await upvote({
      userId: user._id,
      submissionId: params.submissionId,
    });
  };

  const handleDownvote = async () => {
    await downvote({
      userId: user._id,
      submissionId: params.submissionId,
    });
  };

  const handleMakeWinner = async () => {
    makeWinner({
      userId: user._id,
      submissionId: params.submissionId,
    })
      .then(() => {
        toast.success("Winner selected successfully.");
      })
      .catch((error) => {
        console.log(error);
        toast.error("Something went wrong.");
      });
  };

  const handleRemoveWinner = async () => {
    removeWinner({
      userId: user._id,
      submissionId: params.submissionId,
    })
      .then(() => {
        toast.success("Winner removed successfully.");
      })
      .catch((error) => {
        console.log(error);
        toast.error("Something went wrong.");
      });
  };

  return (
    <div className="mx-2">
      <div className="flex justify-between items-center my-5 max-w-4xl mx-auto">
        <p className="text-xl text-center mx-2  font-semibold">
          Submitted to:{" "}
          <Link
            href={`/${fair?.map((item) => item._id)[0]}`}
            className="text-blue-500"
          >
            {fair?.map((item) => item.title)[0]}
          </Link>
        </p>

        {fair?.map((item) => item.judgeId).includes(user?._id) &&
          !singleSubmission?.map((item) => item.winner)[0] && (
            <Button onClick={handleMakeWinner}>Make Winner</Button>
          )}
        {singleSubmission?.map((item) => item.winner)[0] && (
          <div>
            <p>
              Contact the winner:{" "}
              <Link
                href={`mailto:${singleSubmission?.map((item) => item.email)}`}
                className="text-blue-500"
                target="_blank"
              >
                {singleSubmission?.map((item) => item.email)}
              </Link>
            </p>
            <p>
              Mistake?{" "}
              <span
                className="text-blue-500 underline"
                onClick={handleRemoveWinner}
              >
                remove winner
              </span>
            </p>
          </div>
        )}
        {singleSubmission
          ?.map((submission) => submission.userId)
          .includes(user._id) && (
          <div className="flex space-x-3 justify-end">
            <Button
              onClick={() => {
                router.push(
                  `/${fair?.map((item) => item._id)}/edit-submission/${singleSubmission?.map((item) => item._id)}`
                );
              }}
            >
              Edit
            </Button>
            <Button variant="destructive" onClick={onDelete}>
              Delete
            </Button>
          </div>
        )}
      </div>
      {singleSubmission?.map((item) => (
        <div key={item._id} className="max-w-4xl mx-auto">
          <Carousel>
            <CarouselContent>
              {item.imageUrls.map((url) => (
                <CarouselItem key={url}>
                  <AspectRatio ratio={16 / 9}>
                    <img src={url} className="object-cover w-full h-full" />
                  </AspectRatio>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="absolute top-1/2 left-2 transform -translate-y-1/2 transition-opacity duration-300 cursor-pointer" />
            <CarouselNext className="absolute top-1/2 right-2 transform -translate-y-1/2 transition-opacity duration-300 cursor-pointer" />
          </Carousel>

          <div>
            <h1 className="text-2xl font-bold my-5">{item.title}</h1>
            <p className="">{item.about}</p>

            <div className="flex space-x-2 text-gray-600 my-4">
              <div className="flex">
                <ArrowBigUp
                  className={`cursor-pointer hover:stroke-black ${item.votes?.find((vote) => vote.userId === user._id)?.voteType == "upvote" ? "fill-black stroke-black" : ""}`}
                  onClick={handleUpvote}
                />
                <p>{item.upvotes ? item.upvotes : "0"}</p>
              </div>
              <div className="flex">
                <ArrowBigDown
                  className={`cursor-pointer hover:stroke-black ${item.votes?.find((vote) => vote.userId === user._id)?.voteType == "downvote" ? "fill-black stroke-black" : ""}`}
                  onClick={handleDownvote}
                />
                <p>{item.downvotes ? item.downvotes : "0"}</p>
              </div>
            </div>

            <Comments submissionId={item._id} submissionUserId={item.userId} />
          </div>
        </div>
      ))}
    </div>
  );
};

export default page;
