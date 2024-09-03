"use client";

import { Button } from "@/components/ui/button";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useMutation, useQuery } from "convex/react";
import Link from "next/link";
import { redirect, useRouter } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AboutFair from "@/components/about-fair";
import Submissions from "@/components/submissions";
import toast from "react-hot-toast";
import SyncLoader from "react-spinners/SyncLoader";
import Image from "next/image";
import EmptyImg from "@/assets/empty.svg";
import { SquarePen, Trash } from "lucide-react";

const FairPage = ({ params }: { params: { fairId: Id<"fairs"> } }) => {
  const user = useQuery(api.users.getCurrentUser);
  const fair = useQuery(api.fairs.getSingleFair, {
    id: params.fairId,
  });
  const router = useRouter();

  const submissions = useQuery(api.submissions.getSubmissionsByFair, {
    id: params.fairId,
  });

  // if (user?._id === fair?.map((item) => item.judgeId)[0]) {
  //   redirect(`/judge/${fair?.map((item) => item.judgeId)[0]}/${params.fairId}`);
  // }

  const deleteFair = useMutation(api.fairs.deleteFair);
  const onDelete = async () => {
    deleteFair({ id: params.fairId as Id<"fairs"> });
    toast.success("Fair deleted successfully.");
    router.back();
  };

  if (submissions == undefined) {
    return (
      <div className="h-[100vh] w-full flex justify-center items-center">
        <SyncLoader />
      </div>
    );
  }
  return (
    <div className="max-w-5xl mx-auto px-4">
      {user?._id == fair?.map((item) => item.judgeId) ? (
        <div className="flex space-x-3 mt-5 justify-end">
          <div
            onClick={() =>
              router.push(`/judge/${user?._id}/edit-fair/${params.fairId}`)
            }
          >
            <SquarePen className="stroke-[#4eb645] hover:stroke-[#33a828] cursor-pointer" />
          </div>
          <div onClick={onDelete}>
            <Trash className="stroke-red-500 cursor-pointer" />
          </div>
        </div>
      ) : (
        <div className="flex space-x-3 mt-5 md:justify-end">
          {submissions
            ?.map((submission) => submission.userId)
            .includes(user!._id) ? (
            <Button disabled className="bg-[#4eb645] mb-2">
              Already Submitted
            </Button>
          ) : (
            <Button
              disabled={submissions
                ?.map((submission) => submission.userId)
                .includes(user!._id)}
              onClick={() => router.push(`/${params.fairId}/submit`)}
              className="bg-[#4eb645] hover:bg-[#33a828] mb-2"
            >
              Make submission
            </Button>
          )}
        </div>
      )}

      <Tabs defaultValue="about">
        <TabsList>
          <TabsTrigger value="about">About</TabsTrigger>
          <TabsTrigger value="submissions">
            Submissions ({`${submissions?.length}`})
          </TabsTrigger>
        </TabsList>
        <TabsContent value="about">
          {fair?.map((item) => (
            <AboutFair
              key={item._id}
              title={item.title}
              subtitle={item.subtitle}
              about={item.about}
              deadline={item.deadline}
              imageUrl={item.imageUrl}
              judgingCriteria={item.judgingCriteria}
              prices={item.prices}
              requirements={item.requirements}
              name={item.judge?.name}
            />
          ))}
        </TabsContent>
        <TabsContent value="submissions" className="mb-10">
          {submissions?.length > 0 ? (
            <Submissions
              fairId={fair?.map((item) => item._id) as Id<"fairs">[]}
            />
          ) : (
            <div className="w-full flex justify-center items-center">
              <div className="flex flex-col justify-center items-center mt-3">
                <Image src={EmptyImg} alt="empty" className="w-40 h-40" />
                <p className="text-xl font-semibold mt-3">No submissions yet</p>
              </div>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FairPage;
