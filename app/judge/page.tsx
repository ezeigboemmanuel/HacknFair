"use client";
import { useQuery } from "convex/react";
import CreateCompetition from "./_components/create-competition";
import { api } from "@/convex/_generated/api";
import { useEffect } from "react";

const JudgePage = () => {
  const fairs = useQuery(api.fair.get);

  return (
    <div>
      <CreateCompetition />
      {fairs?.map((fair) => (
        <div key={fair._id}>
          <img src={fair.imageUrl} />
          <p>{fair.imageUrl}</p>
          <p>{fair.title}</p>
          <p>{fair.subtitle}</p>
        </div>
      ))}
    </div>
  );
};

export default JudgePage;
