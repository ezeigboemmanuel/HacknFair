"use client"

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
import {
  ArrowBigDown,
  ArrowBigUp,
  MessageSquare,
  SquarePen,
  Trash,
} from "lucide-react";
import Comments from "@/components/comments";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import { useState } from "react";
import Submissions from "@/components/submissions";
import MarkdownDisplay from "@/components/markdown-display";
import SyncLoader from "react-spinners/SyncLoader";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const SubmissionPage = ({ params }: { params: { submissionId: Id<"submissions"> } }) => {
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

  if (fair == undefined || singleSubmission == undefined) {
    return (
      <div className="h-[100vh] w-full flex justify-center items-center">
        <SyncLoader />
      </div>
    );
  }
  return (
    <div>
        <div className="flex flex-col md:flex-row space-y-2 justify-between items-center py-5 max-w-4xl mx-auto">
        <p className="text-xl font-semibold">
          Submitted to:{" "}
          <Link
            href={`/${fair?.map((item) => item._id)[0]}`}
            className="text-green"
          >
            {fair?.map((item) => item.title)[0]}
          </Link>
        </p>

        {fair?.map((item) => item.judgeId).includes(user?._id) &&
          !singleSubmission?.map((item) => item.winner)[0] && (
            <Button
              onClick={handleMakeWinner}
              className="bg-[#4eb645] hover:bg-[#33a828]"
            >
              Make Winner
            </Button>
          )}
        {fair?.map((item) => item.judgeId).includes(user?._id) &&
          singleSubmission?.map((item) => item.winner)[0] && (
            <div>
              <p>
                Contact the winner:{" "}
                <Link
                  href={`mailto:${singleSubmission?.map((item) => item.email)}`}
                  className="text-[#4eb645]"
                  target="_blank"
                >
                  {singleSubmission?.map((item) => item.email)}
                </Link>
              </p>
              <p>
                Mistake?{" "}
                <Dialog>
                  <DialogTrigger>
                    <span className="text-red-500 underline cursor-pointer">
                      remove winner
                    </span>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Are you absolutely sure?</DialogTitle>
                      <DialogDescription>
                        This will remove this user as the winner of your fair.
                      </DialogDescription>
                    </DialogHeader>

                    <DialogFooter>
                      <Button
                        onClick={handleRemoveWinner}
                        variant="destructive"
                      >
                        Remove
                      </Button>
                      <DialogClose asChild>
                        <Button variant="outline">Cancel</Button>
                      </DialogClose>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </p>
            </div>
          )}
        {!fair?.map((item) => item.judgeId).includes(user?._id) &&
          (singleSubmission?.map((item) => item.userId).includes(user?._id) &&
          singleSubmission?.map((item) => item.winner)[0] ? (
            <div>You won! The organisers would contact you via email.</div>
          ) : (
            singleSubmission?.map((item) => item.winner)[0] && <div>Winner</div>
          ))}
        {singleSubmission
          ?.map((submission) => submission.userId)
          .includes(user._id) &&
          !singleSubmission?.map((item) => item.winner)[0] && (
            <div className="flex space-x-3 justify-end items-center">
              <div
                onClick={() => {
                  router.push(
                    `/${fair?.map((item) => item._id)}/edit-submission/${singleSubmission?.map((item) => item._id)}`
                  );
                }}
              >
                <SquarePen className="stroke-[#4eb645] hover:stroke-[#33a828] cursor-pointer" />
              </div>
              <Dialog>
                <DialogTrigger>
                  <Trash className="stroke-red-500 cursor-pointer" />
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Are you absolutely sure?</DialogTitle>
                    <DialogDescription>
                      This action cannot be undone. This will permanently delete
                      your submission from our database.
                    </DialogDescription>
                  </DialogHeader>

                  <DialogFooter>
                    <Button onClick={onDelete} variant="destructive">
                      Delete
                    </Button>
                    <DialogClose asChild>
                      <Button variant="outline">Cancel</Button>
                    </DialogClose>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
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
            <MarkdownDisplay>{item.about}</MarkdownDisplay>

            <div className="flex space-x-2 text-gray-600 my-4">
              <div className="flex">
                <ArrowBigUp
                  className={`cursor-pointer hover:stroke-[#4eb645] ${item.votes?.find((vote) => vote.userId === user._id)?.voteType == "upvote" ? "fill-[#4eb645] stroke-[#4eb645]" : ""}`}
                  onClick={handleUpvote}
                />
                <p>{item.upvotes ? item.upvotes : "0"}</p>
              </div>
              <div className="flex">
                <ArrowBigDown
                  className={`cursor-pointer hover:stroke-[#4eb645] ${item.votes?.find((vote) => vote.userId === user._id)?.voteType == "downvote" ? "fill-[#4eb645] stroke-[#4eb645]" : ""}`}
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
  )
}

export default SubmissionPage