"use client";

import MakeSubmission from "@/components/make-submission";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useQuery } from "convex/react";
import { redirect, useParams, useRouter } from "next/navigation";

const SubmitPage = () => {
  const params = useParams()
  const submissions = useQuery(api.submissions.getSubmissionsByFair, {id: params.fairId as Id<"fairs">});
  const user = useQuery(api.users.getCurrentUser);
  const router = useRouter();
  const fair = useQuery(api.fairs.getSingleFair, {
    id: params.fairId as Id<"fairs">,
  });
  if (submissions?.map((submission) => submission.userId).includes(user!._id)){
    redirect(`/${fair?.map((item) => item._id)}/${submissions.map((submission) => submission._id)[0]}`)
  }
    return (
      <div>
        <MakeSubmission />
      </div>
    );
};

export default SubmitPage;
