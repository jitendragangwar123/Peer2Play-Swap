"use client";
import Image from "next/image";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Link from "next/link";
import GithubIcon from "./svg/GithubIcon";
import UpRightArrowIcon from "./svg/UpRightArrowIcon";

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden">
      <div
        className="absolute inset-0 w-full h-full bg-cover bg-center"
        style={{
          backgroundImage: 'url("/raffle-background.jpg")',
          filter: "blur(8px)",
          transform: "translateZ(-1px) scale(1.5)",
        }}
      ></div>
      <Header />
      <div className="relative flex flex-col items-center justify-center min-h-screen py-10 mt-6 font-arcade">
        <div className="flex flex-col items-center justify-center w-full max-w-6xl gap-12 mb-5 text-center lg:flex-row lg:text-left">
          <div className="flex flex-col w-full gap-6 px-4 lg:w-1/2">
            <h1 className="text-3xl font-bold text-gray-800 md:text-4xl lg:text-5xl dark:text-gray-200">
              Welcome to
            </h1>
            <h2 className="text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-red-500 md:text-6xl lg:text-7xl animate-bounce">
              Peer2Play Swap
            </h2>
            <p className="text-base text-gray-800 md:text-lg lg:text-2xl dark:text-gray-200">
              Seamless Token Swapping & Liquidity Management Platform!
            </p>
            <div className="flex flex-col gap-4 mt-6 sm:flex-row">
              <Link href="https://github.com/jitendragangwar123/Peer2Play-Swap" legacyBehavior>
                <a className="flex items-center justify-center gap-2 px-6 py-3 text-sm font-medium text-white transition duration-500 ease-in-out transform bg-gradient-to-r from-yellow-400 to-red-500 border-2 border-yellow-600 rounded-md shadow-lg hover:bg-blue-700 hover:translate-y-1 active:bg-blue-800 md:text-lg">
                  <span>Welcome to P2P Swap</span>
                  <GithubIcon />
                </a>
              </Link>
              <Link href="/liquidity-pool" legacyBehavior>
                <a className="flex items-center justify-center gap-2 px-6 py-3 text-sm font-medium text-blue-600 transition duration-500 ease-in-out transform bg-white border-2 border-blue-600 rounded-md shadow-lg hover:bg-blue-600 hover:text-white hover:translate-y-1 active:bg-gray-100 md:text-lg">
                  <span>Start Exploring</span>
                  <UpRightArrowIcon />
                </a>
              </Link>
            </div>
          </div>
          <div className="relative flex justify-center w-full px-4 lg:w-1/2 lg:justify-end">
            <Image
              className="relative transition duration-500 ease-in-out transform hover:scale-110 hover:drop-shadow-[0_0_20px_rgba(59,130,246,0.8)]"
              src="/raffle.png"
              alt="raffle image"
              width={400}
              height={150}
              priority
            />
          </div>
        </div>
      </div>
      <div className="relative z-0">
        <Footer />
      </div>
    </main>
  );
}
