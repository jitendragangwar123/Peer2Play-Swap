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
      <header className="w-full fixed backdrop-blur-2xl font-arcade font-bold light:border-neutral-800 bg-gradient-to-r from-yellow-300 to-red-500 lg:light:bg-zinc-800/50 left-0 top-0 z-10 flex flex-wrap gap-4 py-2 px-2 md:py-1 md:px-10 justify-between items-center">
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

          <ThemeSwitch
            className="flex md:hidden lg:hidden sm:hidden dark:transform-none transform dark:translate-none transition-all duration-500 ease-in-out"
            action={changeTheme}
            theme={theme}
            openMenu={openMenu}
          />
        </div>

        <div className="flex items-center md:hidden gap-8">
          <ThemeSwitch
            className="flex md:hidden dark:transform-none transform dark:translate-none transition-all duration-500 ease-in-out"
            action={changeTheme}
            theme={theme}
            openMenu={openMenu}
          />
          <button
            title="toggle menu"
            onClick={toggleMenu}
            className="flex flex-col gap-2 md:hidden"
          >
            <div
              className={`w-[1.5em] h-[2px] ${
                theme === "dark" ? "bg-[#ffffff]" : "bg-[#000000]"
              } rounded-full transition-all duration-300 ease-in-out ${
                openMenu
                  ? "rotate-45 translate-y-[0.625em]"
                  : "rotate-0 translate-y-0"
              }`}
            ></div>
            <div
              className={`w-[1.5em] h-[2px] ${
                theme === "dark" ? "bg-[#ffffff]" : "bg-[#000000]"
              } rounded-full transition-all duration-300 ease-in-out ${
                openMenu ? "opacity-0" : "opacity-100"
              }`}
            ></div>
            <div
              className={`w-[1.5em] h-[2px] ${
                theme === "dark" ? "bg-[#ffffff]" : "bg-[#000000]"
              } rounded-full transition-all duration-300 ease-in-out ${
                openMenu
                  ? "-rotate-45 translate-y-[-0.625em]"
                  : "rotate-0 translate-y-0"
              }`}
            ></div>
          </button>
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