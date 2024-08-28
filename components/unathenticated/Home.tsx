"use client";

import Image from "next/image";
import HomeImg from "@/assets/homeimg.jpg";
import { Button } from "../ui/button";
import { SignInButton } from "@clerk/nextjs";

const Home = () => {
  return (
    <div className="max-w-[1400px] mx-auto">
      <div className="relative w-full h-[75vh] bg-cover bg-center bg-no-repeat">
        <div className="absolute inset-0 -z-10">
          <Image
            src={HomeImg}
            fill
            alt="banner-img"
            className="object-cover object-center brightness-50"
          />
        </div>

        <div className="text-white h-full flex flex-col justify-center px-3 lg:px-10">
          <h1 className="text-4xl pb-5 font-bold md:text-5xl lg:text-6xl">HacknFair</h1>

          <p className="pr-2 md:text-md lg:text-lg">
            Host science fair campaigns and showcase innovative student
            submissions
          </p>

          <SignInButton>
            <Button className="bg-green-600 hover:bg-green-500 text-base rounded-none max-w-[250px] mt-10">
              Sign In
            </Button>
          </SignInButton>
        </div>
      </div>


      <div>
        
      </div>
    </div>
  );
};

export default Home;
