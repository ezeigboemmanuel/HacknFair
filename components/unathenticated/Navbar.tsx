"use client";
import { SignInButton } from "@clerk/nextjs";
import Link from "next/link";
import React, { useState } from "react";
import { Button } from "../ui/button";
import { Menu, X } from "lucide-react";

const Navbar = () => {
  const [isNavOpen, setIsNavOpen] = useState(false);
  return (
    <div className="px-2 md:px-10 max-w-[1400px] mx-auto fixed w-full bg-white z-50 top-0 left-0 right-0">
      <div className="flex items-center justify-between py-8 lg:py-4">
        <Link href="/" className="font-semibold font-serif md:text-lg">
          Hack<span className="text-[#4EB645]">n</span>Fair
        </Link>
        <nav>
          <section className="flex lg:hidden">
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
                <SignInButton>
                  <Link
                    href="/"
                    className="hover:text-[#4EB645] font-[500]"
                    onClick={() => setIsNavOpen(false)}
                  >
                    Fairs
                  </Link>
                </SignInButton>
                <SignInButton>
                  <Link
                    href="/dashboard"
                    className="hover:text-[#4EB645] font-[500]"
                    onClick={() => setIsNavOpen(false)}
                  >
                    Dashboard
                  </Link>
                </SignInButton>
                <Link
                  href="/about"
                  className="hover:text-[#4EB645] font-[500]"
                  onClick={() => setIsNavOpen(false)}
                >
                  About
                </Link>
                <SignInButton>
                  <Button className="bg-[#4EB645] hover:bg-[#60e454] w-full text-base">
                    Sign In
                  </Button>
                </SignInButton>
              </div>
            </div>
          </section>

          <div className="hidden lg:flex justify-between items-center py-6 px-4">
            <div className="flex space-x-5 items-center">
              <SignInButton>
                <Link href="/" className="hover:text-[#4EB645] font-[500]">
                  Fairs
                </Link>
              </SignInButton>
              <SignInButton>
                <Link
                  href="/dashboard"
                  className="hover:text-[#4EB645] font-[500]"
                >
                  Dashboard
                </Link>
              </SignInButton>
              <Link href="/about" className="hover:text-[#4EB645] font-[500]">
                About
              </Link>
              <SignInButton>
                <Button className="bg-[#4EB645] hover:bg-[#60e454] w-full text-base">
                  Sign In
                </Button>
              </SignInButton>
            </div>
          </div>
        </nav>
      </div>
    </div>
  );
};

export default Navbar;
