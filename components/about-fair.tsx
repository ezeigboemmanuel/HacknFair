import { AspectRatio } from "./ui/aspect-ratio";
import { marked } from "marked";

import { Separator } from "./ui/separator";
import MarkdownDisplay from "./markdown-display";

interface AboutFairProps {
  title: string;
  subtitle: string;
  deadline: string | undefined;
  imageUrl: string;
  about: string;
  requirements: string | undefined;
  prices: string | undefined;
  judgingCriteria: string | undefined;
  name?: string;
}

const AboutFair = ({
  title,
  subtitle,
  deadline,
  imageUrl,
  about,
  requirements,
  prices,
  judgingCriteria,
  name,
}: AboutFairProps) => {
  return (
    <div className="mt-5">
      <h1 className="font-bold break-normal text-3xl md:text-5xl">{title}</h1>
      <h3 className="italic text-gray-500">{subtitle}</h3>
      <p className="mt-2 mb-2 text-sm">Created by: {name}</p>
      <p className="mt-2 mb-2 text-sm">Deadline: {deadline}</p>
      <AspectRatio ratio={16 / 9}>
        <img src={imageUrl} className="object-cover w-full h-full" />
      </AspectRatio>

      <h2 className="my-6 font-semibold text-2xl">ABOUT</h2>
      <MarkdownDisplay>{about}</MarkdownDisplay>
      
      <h2 className="my-6 font-semibold text-2xl">REQUIREMENTS</h2>
      <MarkdownDisplay>{requirements}</MarkdownDisplay>
      
      <h2 className="my-6 font-semibold text-2xl">PRICES</h2>
      <MarkdownDisplay>{prices}</MarkdownDisplay>
      
      <h2 className="my-6 font-semibold text-2xl">JUDGING CRITERIA</h2>
      <MarkdownDisplay>{judgingCriteria}</MarkdownDisplay>
    </div>
  );
};

export default AboutFair;
