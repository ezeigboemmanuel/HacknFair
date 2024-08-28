import Link from "next/link";
import React from "react";

const Footer = () => {
  return (
    <footer className="bg-[#162415] text-white">
      <div className="w-full max-w-screen-xl mx-auto p-4 md:py-8">
        <div className="sm:flex sm:items-center sm:justify-between">
          <div className="mb-4">
            <Link
              href="/"
              className="font-semibold font-serif text-xl md:text-2xl"
            >
              Hack<span className="text-[#4EB645]">n</span>Fair
            </Link>
            <span className="text-xs">
              {" "}by{" "}
              <Link href="https://zgboportfolio.vercel.app" target="_blank" className="hover:underline">
                Emmanuel Ezeigbo
              </Link>
            </span>
          </div>

          <ul className="flex flex-wrap items-center mb-6 text-sm font-medium text-gray-200 sm:mb-0">
            <li>
              <Link
                href="/about"
                className="hover:text-[#4EB645] font-[500] me-4 md:me-6"
              >
                About
              </Link>
            </li>
            <li>
              <Link
                href="/privacy-policy"
                className="hover:text-[#4EB645] font-[500] me-4 md:me-6"
              >
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link
                href="https://www.linkedin.com/in/ezeigbo-emmanuel-88393a202/"
                target="_blank"
                className="hover:text-[#4EB645] font-[500] me-4 md:me-6"
              >
                LinkedIn
              </Link>
            </li>
            <li>
              <Link
                href="https://x.com/zgbocode"
                target="_blank"
                className="hover:text-[#4EB645] font-[500] me-4 md:me-6"
              >
                Twitter/X
              </Link>
            </li>
          </ul>
        </div>
        <hr className="my-6 border-gray-200 sm:mx-auto dark:border-gray-700 lg:my-8" />
        <span className="block text-sm text-gray-200 sm:text-center dark:text-gray-400">
          © 2024{" "}
          <Link href="/" className="hover:underline">
            {" "}HacknFair
          </Link>
          . All Rights Reserved.
        </span>
      </div>
    </footer>
  );
};

export default Footer;
