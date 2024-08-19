import { Id } from "@/convex/_generated/dataModel";
import Link from "next/link";

interface FairCardProps {
    link: string;
    imageUrl: string;
    title: string;
    subtitle: string;
    deadline: string | undefined;
    userId: Id<"users"> | undefined;
    judgeId: string;
}

const FairCard = ({link, imageUrl, title, subtitle, deadline, userId, judgeId}: FairCardProps) => {
  return (
    <Link href={`/${link}`}>
      <div className="relative mx-auto max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 hover:shadow-lg">
        {userId === judgeId && <div className="absolute top-0 right-0 bg-black text-white p-1 text-sm rounded-md">Judge</div>}
        <img className="rounded-t-lg" src={imageUrl} alt="" />
        <div className="p-5">
          <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
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
