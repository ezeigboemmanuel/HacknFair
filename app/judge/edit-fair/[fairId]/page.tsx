"use client";
import { api } from "@/convex/_generated/api";
import { useMutation, useQuery } from "convex/react";
import EditCompetition from "../../_components/edit-competition";
import { Id } from "@/convex/_generated/dataModel";

const EditPage = ({ params }: { params: { fairId: Id<"fairs"> } }) => {
  const fair = useQuery(api.fairs.getSingleFair, {
    id: params.fairId as Id<"fairs">,
  });
  return (
    <div>
      {fair?.map((item) => (
        <EditCompetition
          key={item._id}
          title={item.title}
          subtitle={item.subtitle}
          initialDeadline={item.deadline!}
          about={item.about}
          requirements={item.requirements}
          prices={item.prices}
          judgingCriteria={item.judgingCriteria}
          imageURL={item.imageUrl}
          fairId={params.fairId}
        />
      ))}
    </div>
  );
};

export default EditPage;
