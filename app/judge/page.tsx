"use client";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const JudgePage = () => {
  const fairs = useQuery(api.fairs.get);

  return (
    <div>
      <Link href="/judge/create-fair">
        <Button className="m-10">Create fair</Button>
      </Link>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {fairs?.map((fair) => (
          <Link key={fair._id} href={`/judge/${fair._id}`}>
            <div className="mx-auto max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 hover:shadow-lg">
              <a href="#">
                <img className="rounded-t-lg" src={fair.imageUrl} alt="" />
              </a>
              <div className="p-5">
                <a href="#">
                  <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                    {fair.title}
                  </h5>
                </a>
                <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
                  {fair.subtitle}
                </p>
                <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
                  Deadline: {fair.deadline}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default JudgePage;
