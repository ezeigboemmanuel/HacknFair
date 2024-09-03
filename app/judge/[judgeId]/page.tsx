"use client";

import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Button } from "@/components/ui/button";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useQuery } from "convex/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import SyncLoader from "react-spinners/SyncLoader";

const Fairs = ({ params }: { params: { judgeId: Id<"users"> } }) => {
  const fairs = useQuery(api.fairs.getFairsByUser, { id: params.judgeId });
  const user = useQuery(api.users.getCurrentUser);

  const router = useRouter();
  setTimeout(() => {
    router.push(`/dashboard`);
  }, 4000);

  if (fairs == undefined) {
    return (
      <div className="h-[100vh] w-full flex justify-center items-center">
        <SyncLoader />
      </div>
    );
  }
  return (
    <div>
      {/* <Link href={`/judge/${user?._id}/create-fair`}>
        <Button className="m-10">Create fair</Button>
      </Link> */}
      {fairs?.length === 0 && <p>No fair found.</p>}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-5">
        {fairs?.map((fair) => (
          <Link key={fair._id} href={`/${fair._id}`}>
            <div className="mx-auto max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 hover:shadow-lg">
              <AspectRatio ratio={16 / 12}>
                <img
                  className="rounded-t-lg object-cover w-full h-full"
                  src={fair.imageUrl}
                  alt=""
                />
              </AspectRatio>
              <div className="p-5">
                <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                  {fair.title}
                </h5>
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

export default Fairs;
