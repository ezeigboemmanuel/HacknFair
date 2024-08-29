"use client";
import Link from "next/link";
import React, { useState } from "react";
import { Button } from "./ui/button";
import { Menu, X } from "lucide-react";
import { UserButton } from "@clerk/nextjs";

const Navbar = () => {
  const [isNavOpen, setIsNavOpen] = useState(false);
  return (
    <div className="px-4 md:px-10 max-w-[1400px] mx-auto fixed w-full bg-white z-50 top-0 left-0 right-0 shadow-sm">
      <div className="flex items-center justify-between py-8 lg:py-4">
        <Link href="/" className="font-semibold font-serif md:text-lg">
          Hack<span className="text-[#4EB645]">n</span>Fair
        </Link>
        <nav>
          <section className="flex lg:hidden">
            <div className="pr-2"><UserButton /></div>
            
            <div
              className="space-y-2 pr-2"
              onClick={() => setIsNavOpen((prev) => !prev)}
            >
              <Menu />
            </div>

            <div className={isNavOpen ? "showMenuNav" : "hideMenuNav"}>
              <div
                className="absolute top-0 right-0 px-4 py-8"
                onClick={() => setIsNavOpen(false)}
              >
                <X />
              </div>
              <div className="flex flex-col items-center justify-between min-h-[250px] w-full px-3 uppercase">
                <Link href="/" className="hover:text-[#4EB645] font-[500]">
                  Home
                </Link>
                <Link href="/fairs" className="hover:text-[#4EB645] font-[500]">
                  Fairs
                </Link>
                <Link
                  href="/dashboard"
                  className="hover:text-[#4EB645] font-[500]"
                >
                  Dashboard
                </Link>
                <Link href="/about" className="hover:text-[#4EB645] font-[500]">
                  About
                </Link>
              </div>
            </div>
          </section>

          <div className="hidden lg:flex justify-between items-center py-6 px-4">
            <div className="flex space-x-5 items-center">
              <Link href="/" className="hover:text-[#4EB645] font-[500]">
                Home
              </Link>
              <Link href="/fairs" className="hover:text-[#4EB645] font-[500]">
                Fairs
              </Link>
              <Link
                href="/judge"
                className="hover:text-[#4EB645] font-[500]"
              >
                Dashboard
              </Link>
              <Link href="/about" className="hover:text-[#4EB645] font-[500]">
                About
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
