"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Menu, X, User, Bookmark, Star } from "lucide-react";
import prorepLogo from "../../assets/prorep-logo.png";

const departments = [
  "Applied Chemistry", "Applied Mathematics", "Applied Physics", "Biotechnology",
  "Civil Engineering", "Computer Engineering", "Design", "Electrical Engineering",
  "Electronics & Communication", "Environmental Engineering", "Information Technology",
  "Mechanical Engineering", "Polymer Science", "Production & Industrial",
  "Software Engineering", "Management", "Economics",
];

const sampleProblems = [
  {
    id: "1",
    title: "Optimizing Water Filtration",
    department: "Environmental Engineering",
    description: "Design an affordable water filter for rural communities...",
  },
  {
    id: "2",
    title: "AI Proctoring System",
    department: "Computer Engineering",
    description: "Build a secure AI-based exam monitoring system...",
  },
];

export default function StudentProblems() {
  const [selectedDept, setSelectedDept] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [flip, setFlip] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => setFlip((prev) => !prev), 5000);
    return () => clearInterval(interval);
  }, []);

  const filteredProblems = selectedDept
    ? sampleProblems.filter((p) => p.department === selectedDept)
    : sampleProblems;

  const navItems = [
    { name: "Profile", icon: <User size={18} />, path: "#" },
    { name: "Interested", icon: <Star size={18} />, path: "#" },
    { name: "Bookmarked", icon: <Bookmark size={18} />, path: "#" },
  ];

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 overflow-hidden pb-32">
      {/* Background */}
      <div className="absolute -top-40 -left-32 w-[300px] h-[300px] bg-purple-300 rounded-full blur-[160px] opacity-30 z-0" />
      <div className="absolute -bottom-40 -right-32 w-[300px] h-[300px] bg-blue-300 rounded-full blur-[160px] opacity-30 z-0" />
      <div className="absolute top-0 left-0 w-24 h-24 bg-blue-900 rounded-br-full z-0" />

      {/* Sidebar */}
      <button className="fixed top-4 left-4 z-50 bg-blue-700 text-white p-2 rounded-md shadow-md" onClick={() => setSidebarOpen(true)}>
        <Menu size={22} />
      </button>

      <motion.div
        initial={{ x: -300, opacity: 0 }}
        animate={sidebarOpen ? { x: 0, opacity: 1 } : { x: -300, opacity: 0 }}
        transition={{ type: "tween", ease: "easeInOut", duration: 0.4 }}
        className="fixed top-0 left-0 h-full w-64 bg-white z-50 shadow-lg p-6 flex flex-col gap-4"
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-blue-700">ProRep</h2>
          <button onClick={() => setSidebarOpen(false)}>
            <X size={22} />
          </button>
        </div>
        {navItems.map((item, i) => (
          <Link key={i} href={item.path} className="flex items-center gap-3 px-3 py-2 text-sm rounded-md hover:bg-blue-100 text-gray-700 transition-all">
            {item.icon}
            {item.name}
          </Link>
        ))}
      </motion.div>

      {/* Logo flip */}
      <motion.div
        className="pt-6 flex justify-center z-10 relative"
        animate={{ rotateY: flip ? 180 : 0 }}
        transition={{ duration: 1.2, ease: "easeInOut" }}
        style={{ perspective: 1000 }}
      >
        <motion.div className="w-[160px] h-[60px] [transform-style:preserve-3d]" animate={{ rotateY: flip ? 180 : 0 }}>
          <motion.div className="absolute w-full h-full backface-hidden" style={{ backfaceVisibility: "hidden" }}>
            <Image src={prorepLogo} alt="ProRep Logo" width={160} height={60} />
          </motion.div>
          <motion.div className="absolute w-full h-full backface-hidden flex items-center justify-center text-xl font-bold text-blue-800" style={{ transform: "rotateY(180deg)", backfaceVisibility: "hidden" }}>
            ProRep by CCDR
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Department Filter */}
      <div className="max-w-4xl mx-auto px-4 mt-8">
        <select
          value={selectedDept ?? ""}
          onChange={(e) => setSelectedDept(e.target.value || null)}
          className="w-full p-2 border border-gray-300 rounded-md text-sm"
        >
          <option value="">All Departments</option>
          {departments.map((dept, i) => (
            <option key={i} value={dept}>{dept}</option>
          ))}
        </select>
      </div>

      {/* Problem Tiles */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto p-4 mt-6">
        {filteredProblems.map((problem) => (
          <motion.div
            key={problem.id}
            whileHover={{ scale: 1.02 }}
            className="bg-white p-4 rounded-xl shadow-md transition relative"
          >
            <h3 className="text-lg font-semibold text-blue-800 mb-1">{problem.title}</h3>
            <p className="text-sm text-gray-500 mb-2">{problem.department}</p>
            <p className="text-sm text-gray-600 mb-3 line-clamp-3">{problem.description}</p>
            <div className="flex gap-2">
              <button className="px-3 py-1 border border-blue-500 text-blue-600 text-xs rounded hover:bg-blue-50">Bookmark</button>
              <button className="px-3 py-1 border border-purple-500 text-purple-600 text-xs rounded hover:bg-purple-50">Interested</button>
              <Link href={`/problems/${problem.id}`} className="ml-auto text-blue-600 text-xs hover:underline">View Details</Link>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Footer */}
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
