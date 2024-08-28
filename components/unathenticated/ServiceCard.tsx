import EntryImg from "@/assets/entry.svg";
import DoneImg from "@/assets/doneimg.svg";
import VoteImg from "@/assets/voteimg.svg";
import Image from "next/image";
import { AspectRatio } from "../ui/aspect-ratio";

const ServiceCard = () => {
  const services = [
    {
      title: "Competition creation",
      subtitle: "Easily create and manage science fair/hackathons campaigns.",
      image: EntryImg,
    },
    {
      title: "Entry submission",
      subtitle: "Competitors can submit their innovative solutions.",
      image: DoneImg,
    },
    {
      title: "Voting and results management",
      subtitle: "Engage users in voting and announcing winners.",
      image: VoteImg,
    },
  ];
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-6 gap-x-4">
      {services.map((service) => (
        <div className="">
          <div className="group shadow-md hover:shadow-lg">
            <AspectRatio ratio={16 / 12}>
              <Image
                src={service.image}
                alt="service"
                className="object-cover object-center w-full h-full"
              />
            </AspectRatio>
            <div className="bg-white py-4 px-4 ">
              <h2 className="font-bold text-lg md:text-xl group-hover:text-[#4eb645]">
                {service.title}
              </h2>
              <p className="text-slate-600 mt-2">{service.subtitle}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ServiceCard;
