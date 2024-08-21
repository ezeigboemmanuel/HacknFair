"use client"

import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useQuery } from "convex/react";
import Link from "next/link"

interface SubmissionCardProps {
    title: string;
    email: string;
    about: string;
    imageUrls: string[];
    link: string;
    userId: Id<"users">;
    creatorName?: string;
}

const SubmissionCard = ({title, email, about, imageUrls, link, userId, creatorName}: SubmissionCardProps) => {
    const currentUser = useQuery(api.users.getCurrentUser)
  return (
    <Link href={`/${link}`}>
      <div className="relative mx-auto max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 hover:shadow-lg">
        {userId === currentUser?._id && <div className="absolute top-0 right-0 bg-black text-white p-1 text-sm rounded-md">Owner</div>}
        <img className="rounded-t-lg" src={imageUrls.map((url) => url)[0]} alt="" />
        <div className="p-5">
          <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            {title}
          </h5>
          <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
            Created by: {creatorName}
          </p>
        </div>
      </div>
    </Link>
  )
}

export default SubmissionCard