"use client";
import { useState } from "react";
import useTheme from "../hooks/useTheme";
import ThemeSwitch from "./Theme";
import Image from "next/image";
import Link from "next/link";

const Header = () => {
  const [openMenu, setOpenMenu] = useState(false);
  const { theme, changeTheme } = useTheme();
  const toggleMenu = () => {
    setOpenMenu((prev) => !prev);
  };

  return (
    <>
      <header className="w-full fixed backdrop-blur-2xl font-arcade font-bold light:border-neutral-800 bg-gradient-to-r from-yellow-600 to-blue-900 lg:light:bg-zinc-600/50 left-0 top-0 z-10 flex flex-wrap gap-4 py-2 px-2 md:py-1 md:px-10 justify-between items-center">
        <div className="">
          <a href="/">
              <Image
                src="/logo.png"
                alt="logo"
                width={150}
                height={100}
              />
          </a>
        </div>
        
        <div className="hidden md:flex gap-8">
          <div className="flex items-center">
            <w3m-button />
          </div>
        </div>
        <div
          className={`w-screen transition-all duration-300 ease-in-out grid ${
            openMenu
              ? "min-h-[4rem] grid-rows-[1fr] opacity-100"
              : "grid-rows-[0fr] opacity-0"
          } md:hidden`}
        >
          <div className="overflow-hidden">
            <div className="flex flex-wrap gap-8">
              <div className="flex items-center">
                <w3m-button />
              </div>
            </div>
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;
