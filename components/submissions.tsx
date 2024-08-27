"use client";

import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import SubmissionCard from "./submission-card";
import { Id } from "@/convex/_generated/dataModel";
import SyncLoader from "react-spinners/SyncLoader";

const Submissions = ({ fairId }: { fairId: Id<"fairs">[] }) => {
  const submissions = useQuery(api.submissions.get);
  const comments = useQuery(api.comments.get);
  if (submissions == undefined) {
    return (
      <div className="h-[100vh] w-full flex justify-center items-center">
        <SyncLoader />
      </div>
    );
  }
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-5 gap-x-4">
      {submissions?.map(
        (submission) =>
          fairId.includes(submission.fairId) && (
            <SubmissionCard
              key={submission._id}
              title={submission.title}
              about={submission.about}
              email={submission.email}
              imageUrls={submission.imageUrls}
              link={`${fairId}/${submission._id}`}
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
          )
      )}
    </div>
  );
};

export default Submissions;
