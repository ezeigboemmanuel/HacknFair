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

const page = ({ params }: { params: { submissionId: Id<"submissions"> } }) => {
  const singleSubmission = useQuery(api.submissions.getSingleSubmission, {
    id: params.submissionId,
  });
  const fairParam = useParams();
  const fair = useQuery(api.fairs.getSingleFair, {
    id: fairParam.fairId as Id<"fairs">,
  });
  return (
    <div>
      <p className="text-xl text-center mx-2 my-4 font-semibold">
        Submitted to:{" "}
        <Link
          href={`/${fair?.map((item) => item._id)[0]}`}
          className="text-blue-500"
        >
          {fair?.map((item) => item.title)[0]}
        </Link>
      </p>
      {singleSubmission?.map((item) => (
        <div className="max-w-4xl mx-auto">
          <Carousel>
            <CarouselContent>
              {item.imageUrls.map((url) => (
                <CarouselItem>
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
            <h1>{item.title}</h1>
          </div>
        </div>
      ))}
    </div>
  );
};

export default page;
