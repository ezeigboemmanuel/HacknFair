"use client";

import MakeSubmission from "@/components/make-submission";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useQuery } from "convex/react";
import { redirect, useParams, useRouter } from "next/navigation";

const SubmitPage = () => {
  const submissions = useQuery(api.submissions.get);
  const user = useQuery(api.users.getCurrentUser);
  const router = useRouter();
  const params = useParams()
  const fair = useQuery(api.fairs.getSingleFair, {
    id: params.fairId as Id<"fairs">,
  });
  if (submissions?.map((submission) => submission.userId).includes(user!._id)){
    redirect(`/${fair?.map((item) => item._id)[0]}/${submissions.map((submission) => submission._id)[0]}`)
  }
    return (
      <div>
        <MakeSubmission />
      </div>
    );
};

export default SubmitPage;
