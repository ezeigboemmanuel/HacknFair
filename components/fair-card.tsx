import { Id } from "@/convex/_generated/dataModel";
import Link from "next/link";
import { AspectRatio } from "./ui/aspect-ratio";

interface FairCardProps {
  link: string;
  imageUrl: string;
  title: string;
  subtitle: string;
  deadline: string | undefined;
  userId: Id<"users"> | undefined;
  judgeId: string;
}

const FairCard = ({
  link,
  imageUrl,
  title,
  subtitle,
  deadline,
  userId,
  judgeId,
}: FairCardProps) => {
  return (
    <Link href={`/${link}`}>
      <div className="relative mx-auto w-full group bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 hover:shadow-lg">
        {userId === judgeId && (
          <div className="absolute z-10 top-0 right-0 bg-[#4eb645] text-white p-1 text-sm rounded-tr-md">
            Judge
          </div>
        )}
        <AspectRatio ratio={16 / 12}>
          <img
            className="rounded-t-lg object-cover w-full h-full"
            src={imageUrl}
            alt=""
          />
        </AspectRatio>

        <div className="p-5">
          <h5 className="mb-2 text-2xl group-hover:text-[#4eb645] font-bold tracking-tight text-gray-900 dark:text-white">
            {title}
          </h5>
          <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
            {subtitle}
          </p>
          <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
            Deadline: {deadline}
          </p>
        </div>
      </div>
    </Link>
  );
};

export default FairCard;
