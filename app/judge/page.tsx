"use client";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useEffect } from "react";
import Link from "next/link";

const JudgePage = () => {
  const fairs = useQuery(api.fairs.get);

  return (
    <div>
      {fairs?.map((fair) => (
        <Link key={fair._id} href={`/judge/${fair._id}`}>
          <div>
            <img src={fair.imageUrl} />
            <p>{fair.title}</p>
            <p>{fair.subtitle}</p>
            <p>{fair.deadline}</p>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default JudgePage;
