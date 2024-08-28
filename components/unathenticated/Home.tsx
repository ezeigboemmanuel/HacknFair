"use client";

import Image from "next/image";
import HomeImg from "@/assets/homeimg.jpg";
import AboutImg from "@/assets/aboutimg.jpg";
import { Button } from "../ui/button";
import { SignInButton } from "@clerk/nextjs";
import ServiceCard from "./ServiceCard";
import Footer from "./Footer";

const Home = () => {
  return (
    <div className="max-w-[1400px] mx-auto mt-20 md:mt-24 lg:mt-28">
      <div className="relative w-full h-[75vh] bg-cover bg-center bg-no-repeat">
        <div className="fixed inset-0 -z-10">
          <Image
            src={HomeImg}
            fill
            alt="banner-img"
            className="object-cover object-center brightness-50"
          />
        </div>

        <div className="text-white h-full flex flex-col justify-center px-3 lg:px-20">
          <h1 className="text-4xl pb-5 font-bold md:text-5xl lg:text-6xl">
            HacknFair
          </h1>

          <p className="pr-2 md:text-lg">
            Host science fair campaigns and showcase innovative student
            submissions
          </p>

          <SignInButton>
            <Button className="bg-[#4EB645] hover:bg-[#60e454] text-base rounded-none max-w-[250px] mt-10">
              Sign In
            </Button>
          </SignInButton>
        </div>
      </div>

      <div className="bg-white px-4 md:px-16 lg:px-20 py-10 md:py-16 flex flex-col md:flex-row md:space-x-12 items-center">
        <div>
          <p className="uppercase text-[#4EB645] font-bold">
            Empowering young minds
          </p>
          <p className="uppercase font-bold text-lg md:text-xl mt-2">
            Join us in celebrating innovation
          </p>
          <p className="mt-2">
            <span className="font-semibold">HacknFair</span> is a versatile
            online platform designed to host both science fairs and hackathons,
            allowing users to create events, submit proposals, and engage in
            voting and discussions.
            <br />
            What makes it unique is its dual functionality: it caters to
            students, educators, and tech enthusiasts alike by combining the
            excitement of science fairs with the competitive edge of hackathons.
            <br />
            Judges have dedicated tools to select winners, while the community
            can participate through voting and comments, making it an inclusive
            and interactive experience for all.
          </p>
        </div>
        <div className="mt-7">
          <Image
            src={AboutImg}
            alt="about"
            className="object-cover object-center"
          />
        </div>
      </div>

      {/* ========= SERVICES =========== */}

      <div className="bg-[#EEF1EF] py-10 md:py-20 px-4 md:px-16 lg:px-20">
        <div>
          <p className="uppercase text-[#4EB645] font-bold">Our services</p>
          <p className="uppercase font-bold text-lg mt-2">
            Creating a platform for success
          </p>
        </div>

        <div className="pt-10 flex flex-col justify-center items-center">
          <ServiceCard />

          <p className="uppercase font-bold text-lg mt-10">Get Started</p>

          <SignInButton>
            <Button className="bg-[#4EB645] hover:bg-[#60e454] text-base rounded-none w-full md:max-w-[250px] mt-2">
              Sign In
            </Button>
          </SignInButton>
        </div>
      </div>

      {/* ====== FOOTER ======= */}

      <div>
        <Footer />
      </div>
    </div>
  );
};

export default Home;
