"use client";

import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import SubmissionCard from "./submission-card";

const Submissions = () => {
  const submissions = useQuery(api.submissions.get);
  return (
    <div>
      {submissions?.map((submission) => (
        <SubmissionCard
          key={submission._id}
          title={submission.title}
          about={submission.about}
          email={submission.email}
          imageUrls={submission.imageUrls}
          link={submission._id}
          userId={submission.userId}
          creatorName={submission.creator?.name}
        />
      ))}
    </div>
  );
};

export default Submissions;
