"use client";

import { Button } from "@/components/ui/button";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useQuery } from "convex/react";
import Link from "next/link";
import { redirect, useRouter } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AboutFair from "@/components/about-fair";
import Submissions from "@/components/submissions";

const FairPage = ({ params }: { params: { fairId: Id<"fairs"> } }) => {
  const user = useQuery(api.users.getCurrentUser);
  const fair = useQuery(api.fairs.getSingleFair, {
    id: params.fairId,
  });
  const router = useRouter();

  if (user?._id === fair?.map((item) => item.judgeId)[0]) {
    redirect(`/judge/${fair?.map((item) => item.judgeId)[0]}/${params.fairId}`);
  }

  return (
    <div className="max-w-4xl mx-auto px-4">
      <Link
        href={`/${params.fairId}/submit`}
        className="flex space-x-3 mt-5 justify-end"
      >
        <Button>Make submission</Button>
      </Link>
      <Tabs defaultValue="about">
        <TabsList>
          <TabsTrigger value="about">About</TabsTrigger>
          <TabsTrigger value="submissions">Submissions</TabsTrigger>
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
        <TabsContent value="submissions">
          <Submissions />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FairPage;
