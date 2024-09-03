"use client";
import Link from "next/link";
import React, { useState } from "react";
import { Button } from "./ui/button";
import { Menu, X } from "lucide-react";
import { UserButton } from "@clerk/nextjs";
import SearchBar from "./SearchBar";
import { usePathname } from "next/navigation";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

const Navbar = () => {
  const [isNavOpen, setIsNavOpen] = useState(false);
  const pathname = usePathname();
  const user = useQuery(api.users.getCurrentUser);

  return (
    <div className="px-4 md:px-10 max-w-[1400px] mx-auto fixed w-full bg-white z-50 top-0 left-0 right-0 shadow-sm">
      <div className="flex items-center justify-between py-8 lg:py-4">
        <Link href="/" className="hidden md:inline-block font-semibold font-serif md:text-lg">
          Hack<span className="text-[#4EB645]">n</span>Fair
        </Link>
        <Link href="/" className="md:hidden font-semibold font-serif md:text-lg">
          H<span className="text-[#4EB645]">F</span>
        </Link>
        <div className="flex-1">
          <SearchBar />
        </div>
        <nav>
          <section className="flex lg:hidden">
            <div className="pr-2 pl-2">
              <UserButton />
            </div>

            <div
              className="space-y-2 pr-2"
              onClick={() => setIsNavOpen((prev) => !prev)}
            >
              <Menu className="h-7 w-7" />
            </div>

            <div className={isNavOpen ? "showMenuNav" : "hideMenuNav"}>
              <div
                className="absolute top-0 right-0 px-6 pt-8"
                onClick={() => setIsNavOpen(false)}
              >
                <X className="h-7 w-7" />
              </div>
              <div className="flex flex-col items-center justify-between min-h-[250px] w-full px-3 uppercase">
                <Link
                  href="/"
                  className={`hover:text-[#4EB645] font-[500] ${pathname == "/" ? "text-[#4EB645]" : ""}`}
                  onClick={() => setIsNavOpen(false)}
                >
                  Fairs
                </Link>
                <Link
                  href="/dashboard"
                  className={`hover:text-[#4EB645] font-[500] ${pathname == "/dashboard" ? "text-[#4EB645]" : ""}`}
                  onClick={() => setIsNavOpen(false)}
                >
                  Dashboard
                </Link>
                <Link
                  href="/about"
                  className={`hover:text-[#4EB645] font-[500] ${pathname == "/about" ? "text-[#4EB645]" : ""}`}
                  onClick={() => setIsNavOpen(false)}
                >
                  About
                </Link>

                <Link href={`/judge/${user?._id}/create-fair`}>
                  <Button className="bg-[#4EB645] hover:bg-[#60e454] w-full text-base">
                    Create a Fair
                  </Button>
                </Link>
              </div>
            </div>
          </section>

          <div className="hidden lg:flex justify-between items-center py-6 px-4">
            <div className="flex space-x-5 items-center">
              <Link
                href="/"
                className={`hover:text-[#4EB645] font-[500] ${pathname == "/" ? "text-[#4EB645]" : ""}`}
              >
                Fairs
              </Link>
              <Link
                href="/dashboard"
                className={`hover:text-[#4EB645] font-[500] ${pathname == "/dashboard" ? "text-[#4EB645]" : ""}`}
              >
                Dashboard
              </Link>
              <Link
                href="/about"
                className={`hover:text-[#4EB645] font-[500] ${pathname == "/about" ? "text-[#4EB645]" : ""}`}
              >
                About
              </Link>

              <Link href={`/judge/${user?._id}/create-fair`}>
                <Button className="bg-[#4EB645] hover:bg-[#60e454] w-full text-base">
                  Create a Fair
                </Button>
              </Link>
              <UserButton />
            </div>
          </div>
        </nav>
      </div>
    </div>
  );
};

export default Navbar;
