import LiquidityPool from "../components/LiquidityPool/LiquidityPool";
import Footer from "../components/Footer";
import Header from "../components/Header";
import React from "react";

export default async function Page() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: 'url("/raffle-background.jpg")',
          filter: "blur(8px)",
          transform: "translateZ(-1px) scale(1.5)",
        }}
      ></div>
      <Header />
      <LiquidityPool />
      <div className="relative z-0">
        <Footer />
      </div>
    </div>
  );
}
