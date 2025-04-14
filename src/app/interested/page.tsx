"use client";

import { Suspense, useEffect, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import prorepLogo from "../../assets/prorep-logo.png";
import InterestedContent from "./InterestedContent";

export default function InterestedPage() {
  const [flip, setFlip] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => setFlip((prev) => !prev), 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 py-10 px-4 overflow-hidden">
      <div className="absolute -top-40 -left-32 w-[300px] h-[300px] bg-purple-300 rounded-full blur-[160px] opacity-30 z-0" />
      <div className="absolute -bottom-40 -right-32 w-[300px] h-[300px] bg-blue-300 rounded-full blur-[160px] opacity-30 z-0" />
      <div className="absolute top-0 left-0 w-24 h-24 bg-blue-900 rounded-br-full z-0" />

      <motion.div
        className="flex justify-center mb-8 z-10 relative"
        animate={{ rotateY: flip ? 180 : 0 }}
        transition={{ duration: 1.2, ease: "easeInOut" }}
        style={{ perspective: 1000 }}
      >
        <motion.div className="w-[160px] h-[60px] [transform-style:preserve-3d]">
          <motion.div className="absolute w-full h-full backface-hidden" style={{ backfaceVisibility: "hidden" }}>
            <Image src={prorepLogo} alt="ProRep Logo" width={160} height={60} />
          </motion.div>
          <motion.div className="absolute w-full h-full backface-hidden flex items-center justify-center text-xl font-bold text-blue-800" style={{ transform: "rotateY(180deg)", backfaceVisibility: "hidden" }}>
            ProRep by CCDR
          </motion.div>
        </motion.div>
      </motion.div>

      <div className="relative z-10 max-w-6xl mx-auto bg-white rounded-3xl shadow-xl p-8">
        <h1 className="text-3xl font-bold text-blue-800 text-center mb-6">Interested Problems</h1>

        <Suspense fallback={<p>Loading interested problems...</p>}>
          <InterestedContent />
        </Suspense>
      </div>

      <footer className="absolute bottom-0 w-full bg-blue-900 text-white py-6 px-4">
        <div className="flex flex-col items-center relative z-10">
          <p className="text-sm sm:text-base font-semibold mb-3">ProRep by CCDR, DTU</p>
          <div className="flex gap-3">
            <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full" style={{ background: "radial-gradient(circle at 30% 30%, #60a5fa, #3b82f6)" }} />
            <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full" style={{ background: "radial-gradient(circle at 30% 30%, #a78bfa, #7c3aed)" }} />
            <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full" style={{ background: "radial-gradient(circle at 30% 30%, #38bdf8, #0ea5e9)" }} />
          </div>
        </div>
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-900 rounded-bl-[80px] z-0" />
      </footer>
    </div>
  );
}
