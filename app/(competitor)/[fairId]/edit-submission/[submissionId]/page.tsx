"use client";
import EditSubmission from "@/components/edit-submission";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useQuery } from "convex/react";
import React from "react";

const EditPage = ({ params }: { params: { submissionId: string } }) => {
  const user = useQuery(api.users.getCurrentUser);
  const submission = useQuery(api.submissions.getSingleSubmissionByUser, {
    id: params.submissionId as Id<"submissions">,
    userId: user?._id,
  });
  return (
    <div>
      {submission?.map((item) => (
        <EditSubmission
          key={item._id}
          id={item._id}
          title={item.title}
          email={item.email}
          about={item.about}
          fmrStorageIds={item.storageId}
        />
      ))}
    </div>
  );
};

export default EditPage;
