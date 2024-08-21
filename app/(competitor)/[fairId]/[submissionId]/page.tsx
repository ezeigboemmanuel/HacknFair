"use client";

import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useQuery } from "convex/react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowBigDown, ArrowBigUp, MessageSquare } from "lucide-react";
import Comments from "@/components/comments";
import { Button } from "@/components/ui/button";

const page = ({ params }: { params: { submissionId: Id<"submissions"> } }) => {
  const singleSubmission = useQuery(api.submissions.getSingleSubmission, {
    id: params.submissionId,
  });
  const fairParam = useParams();
  const fair = useQuery(api.fairs.getSingleFair, {
    id: fairParam.fairId as Id<"fairs">,
  });
  const user = useQuery(api.users.getCurrentUser);
  if (!user) {
    return;
  }
  return (
    <div className="mx-2">
      <div className="flex justify-between items-center my-5 max-w-4xl mx-auto">
        <p className="text-xl text-center mx-2  font-semibold">
          Submitted to:{" "}
          <Link
            href={`/${fair?.map((item) => item._id)[0]}`}
            className="text-blue-500"
          >
            {fair?.map((item) => item.title)[0]}
          </Link>
        </p>
        {singleSubmission
          ?.map((submission) => submission.userId)
          .includes(user._id) && (
          <div className="flex space-x-3 justify-end">
            <Button onClick={() => {}}>Edit</Button>
            <Button variant="destructive">Delete</Button>
          </div>
        )}
      </div>
      {singleSubmission?.map((item) => (
        <div key={item._id} className="max-w-4xl mx-auto">
          <Carousel>
            <CarouselContent>
              {item.imageUrls.map((url) => (
                <CarouselItem key={url}>
                  <AspectRatio ratio={16 / 9}>
                    <img src={url} />
                  </AspectRatio>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="absolute top-1/2 left-2 transform -translate-y-1/2 transition-opacity duration-300 cursor-pointer" />
            <CarouselNext className="absolute top-1/2 right-2 transform -translate-y-1/2 transition-opacity duration-300 cursor-pointer" />
          </Carousel>

          <div>
            <h1 className="text-2xl font-bold my-5">{item.title}</h1>
            <p className="">{item.about}</p>

            <div className="flex space-x-2 text-gray-600 my-4">
              <div className="flex">
                <ArrowBigUp />
                <p>20</p>
              </div>
              <div className="flex">
                <ArrowBigDown />
                <p>5</p>
              </div>
            </div>

            <Comments />
          </div>
        </div>
      ))}
    </div>
  );
};

export default page;