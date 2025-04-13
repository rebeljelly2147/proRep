"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { Bookmark, Star } from "lucide-react";
import prorepLogo from "../../assets/prorep-logo.png";

export default function ProblemDetails() {
  const [problemDetail, setProblemDetail] = useState<any>(null);
  const { id } = useParams();

  useEffect(() => {
    // Simulate fetch
    setProblemDetail({
      title: "AI for Rural Healthcare",
      domain: "Healthcare",
      statement: "Build an AI tool to assist in diagnostics in rural clinics.",
      department: ["Computer Engineering", "Electronics & Communication"],
      keywords: ["AI", "Healthcare", "Rural"],
      source: "Hackathon 2024",
      link: "https://example.com/problem/ai-healthcare",
      org: "Ministry of Health",
      notes: "Ensure offline-first capabilities."
    });
  }, [id]);

  if (!problemDetail) return <div className="p-8 text-center">Loading...</div>;

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 overflow-hidden pb-32 px-4">
      {/* Background semi-circles */}
      <div className="absolute -top-40 -left-32 w-[300px] h-[300px] bg-purple-300 rounded-full blur-[160px] opacity-30 z-0" />
      <div className="absolute -bottom-40 -right-32 w-[300px] h-[300px] bg-blue-300 rounded-full blur-[160px] opacity-30 z-0" />
      <div className="absolute top-0 left-0 w-24 h-24 bg-blue-900 rounded-br-full z-0" />

      {/* Rotating Logo */}
      <motion.div
        className="pt-6 flex justify-center z-10 relative"
        initial={{ rotateX: -90, opacity: 0 }}
        animate={{ rotateX: 0, opacity: 1 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
      >
        <Image src={prorepLogo} alt="ProRep Logo" width={160} height={60} />
      </motion.div>

      {/* Problem Details */}
      <div className="relative z-10 max-w-4xl mx-auto mt-10 bg-white shadow-lg rounded-2xl p-6 sm:p-10">
        <h1 className="text-3xl font-bold text-blue-800 mb-4">{problemDetail.title}</h1>
        <p className="text-sm text-gray-500 mb-1">Domain: {problemDetail.domain}</p>
        <p className="text-gray-700 mb-6">{problemDetail.statement}</p>

        <div className="mb-4">
          <h2 className="font-semibold text-blue-700">Departments</h2>
          <ul className="list-disc list-inside text-sm text-gray-700">
            {problemDetail.department?.map((dept: string, i: number) => <li key={i}>{dept}</li>)}
          </ul>
        </div>

        <div className="mb-4">
          <h2 className="font-semibold text-blue-700">Keywords</h2>
          <div className="flex flex-wrap gap-2 text-sm">
            {problemDetail.keywords?.map((tag: string, i: number) => (
              <span key={i} className="bg-blue-100 text-blue-700 px-2 py-1 rounded-md">{tag}</span>
            ))}
          </div>
        </div>

        <div className="mb-4">
          <p className="text-sm text-gray-600">Source: {problemDetail.source}</p>
          <p className="text-sm text-gray-600">Organisation: {problemDetail.org}</p>
          <a href={problemDetail.link} target="_blank" className="text-sm text-blue-600 underline">More Info</a>
        </div>

        <div className="mb-4">
          <h2 className="font-semibold text-blue-700">Additional Notes</h2>
          <p className="text-sm text-gray-700">{problemDetail.notes}</p>
        </div>

        <div className="flex gap-3 mt-6">
          <button className="px-4 py-2 border border-blue-500 text-blue-700 rounded hover:bg-blue-50 text-sm flex items-center gap-1">
            <Bookmark size={16} /> Bookmark
          </button>
          <button className="px-4 py-2 border border-purple-500 text-purple-700 rounded hover:bg-purple-50 text-sm flex items-center gap-1">
            <Star size={16} /> Interested
          </button>
        </div>
      </div>

      {/* Footer */}
      <footer className="absolute bottom-0 w-full bg-blue-900 text-white py-6 px-4 mt-10">
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
