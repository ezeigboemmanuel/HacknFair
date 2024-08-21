"use client"

import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useQuery } from "convex/react";

const page = ({ params }: { params: { submissionId: Id<"submissions"> } }) => {
  const singleSubmission = useQuery(api.submissions.getSingleSubmission, {
    id: params.submissionId,
  });
  return <div>{singleSubmission?.map((item) => (
    <div>
        
    </div>
  ))}</div>;
};

export default page;
