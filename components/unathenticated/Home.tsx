"use client";

import Image from "next/image";
import HomeImg from "@/assets/homeimg.jpg";

const Home = () => {
  return (
    <div>
      <div className="relative w-full h-[75vh] bg-cover bg-center bg-no-repeat">
        <div className="absolute inset-0 -z-10">
          <Image
            src={HomeImg}
            fill
            alt="banner-img"
            className="object-cover object-center brightness-50"
          />
        </div>

        <div className="text-white h-full flex flex-col justify-center px-3">
          <h1 className="text-4xl pb-5 font-bold">HacknFair</h1>
          <div className="flex divide-x justify-center pb-10">
            <p className="pr-2">
              Host science fair campaigns and showcase innovative student
              submissions
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
