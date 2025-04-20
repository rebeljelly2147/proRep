"use client";

import { useEffect, useState, useRef } from "react"; // Add useRef
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Menu, X, User, FileText } from "lucide-react";
import prorepLogo from "../../assets/prorep-logo.png";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db, auth } from "../../firebase/firebase";
import toast from "react-hot-toast";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

const dtuDepartments = [
  "Applied Chemistry", "Applied Mathematics", "Applied Physics", "Biotechnology",
  "Civil Engineering", "Computer Engineering", "Design", "Electrical Engineering",
  "Electronics & Communication", "Environmental Engineering", "Information Technology",
  "Mechanical Engineering", "Polymer Science", "Production & Industrial",
  "Software Engineering", "Management", "Economics",
];

export default function AdminDashboard() {
  const router = useRouter();
  const [uid, setUid] = useState<string | null>(null);
  const [keywords, setKeywords] = useState<string[]>([""]);
  const [selectedDepartments, setSelectedDepartments] = useState<string[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [flip, setFlip] = useState(false);
  const intentionalLogout = useRef(false); // Add this ref to track intentional logout
  const sidebarRef = useRef<HTMLDivElement>(null); // Add this ref

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      const role = Cookies.get("userRole");

      // Add check for intentional logout
      if (intentionalLogout.current) {
        // Skip the error message if this is an intentional logout
        return;
      }

      if (!role || role !== "admin" || !user) {
        toast.error("Access Denied. Admins only.");
        router.push("/");
      } else {
        setUid(user.uid);
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => setFlip((prev) => !prev), 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!sidebarOpen) return;

    // Create an overlay that closes sidebar on click
    const overlay = document.createElement('div');
    overlay.className = 'fixed inset-0 z-40';
    overlay.onclick = () => setSidebarOpen(false);
    document.body.appendChild(overlay);

    return () => {
      document.body.removeChild(overlay);
    };
  }, [sidebarOpen]);

  const navItems = [
    { name: "Profile", icon: <User size={18} />, path: uid ? `/adminProfile/${uid}` : "#" },
    { name: "All Problems", icon: <FileText size={18} />, path: "/allProblems" },
  ];

  const addKeyword = () => setKeywords([...keywords, ""]);
  const removeKeyword = (index: number) => {
    const updated = [...keywords];
    updated.splice(index, 1);
    setKeywords(updated);
  };
  const updateKeyword = (index: number, value: string) => {
    const updated = [...keywords];
    updated[index] = value;
    setKeywords(updated);
  };

  const toggleDepartment = (dept: string) => {
    setSelectedDepartments((prev) =>
      prev.includes(dept) ? prev.filter((d) => d !== dept) : [...prev, dept]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const user = auth.currentUser;
    if (!user) {
      toast.error("User not authenticated.");
      return router.push("/");
    }

    const problemData = {
      title: (document.querySelector('input[placeholder="Project Title"]') as HTMLInputElement)?.value,
      domain: (document.querySelector('input[placeholder="Domain"]') as HTMLInputElement)?.value,
      statement: (document.querySelector('textarea[placeholder="Broad Problem Statement"]') as HTMLTextAreaElement)?.value,
      departments: selectedDepartments,
      keywords: keywords.filter(k => k.trim() !== ""),
      source: (document.querySelector('input[placeholder="Problem Source"]') as HTMLInputElement)?.value,
      sourceLink: (document.querySelector('input[placeholder="Source Link"]') as HTMLInputElement)?.value,
      organisation: (document.querySelector('input[placeholder="Relevant Organisation"]') as HTMLInputElement)?.value,
      notes: (document.querySelector('textarea[placeholder="Additional Notes (Optional)"]') as HTMLTextAreaElement)?.value || "",
      createdBy: { uid: user.uid, email: user.email },
      createdAt: serverTimestamp(),
    };

    try {
      await addDoc(collection(db, "problems"), problemData);
      toast.success("Problem statement submitted successfully!");
      setKeywords([""]);
      setSelectedDepartments([]);
      Array.from(document.querySelectorAll("input, textarea")).forEach((el) => (el as HTMLInputElement).value = "");
    } catch (error) {
      console.error(error);
      toast.error("Failed to submit. Try again.");
    }
  };

  const handleLogout = async () => {
    try {
      // Set the intentional logout flag
      intentionalLogout.current = true;

      // Remove the role cookie
      Cookies.remove("userRole");

      // Sign out from Firebase
      await auth.signOut();

      // Show success message and redirect to login page
      toast.success("Successfully logged out");
      router.push("/login");
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Failed to log out");
      // Reset the flag if logout fails
      intentionalLogout.current = false;
    }
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 overflow-hidden pb-48">
      {/* Background Blobs */}
      <div className="absolute -top-40 -left-32 w-[300px] h-[300px] bg-purple-300 rounded-full blur-[160px] opacity-30 z-0" />
      <div className="absolute -bottom-40 -right-32 w-[300px] h-[300px] bg-blue-300 rounded-full blur-[160px] opacity-30 z-0" />
      <div className="absolute top-0 left-0 w-1/4 h-1/2 bg-blue-900 rounded-br-full z-0" />

      {/* Sidebar toggle button */}
      <button className="fixed top-4 left-4 z-50 bg-blue-700 text-white p-2 rounded-md shadow-md" onClick={() => setSidebarOpen(true)}>
        <Menu size={22} />
      </button>

      {/* Logout button - only visible when sidebar is closed */}
      {!sidebarOpen && (
        <button
          className="fixed top-4 right-4 z-50 bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded-md shadow-md text-sm font-medium transition-colors"
          onClick={handleLogout}
        >
          Logout
        </button>
      )}

      <motion.div
        ref={sidebarRef}
        initial={{ x: -300, opacity: 0 }}
        animate={sidebarOpen ? { x: 0, opacity: 1 } : { x: -300, opacity: 0 }}
        transition={{ type: "tween", ease: "easeInOut", duration: 0.4 }}
        className="fixed top-0 left-0 h-full w-64 backdrop-blur-xl bg-white/60 border-r border-white/50 shadow-lg p-6 flex flex-col gap-4 z-50"
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

        <div className="mt-auto pt-4 border-t">
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 px-3 py-2 text-sm rounded-md hover:bg-red-100 text-red-600 transition-all"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
              <polyline points="16 17 21 12 16 7"></polyline>
              <line x1="21" y1="12" x2="9" y2="12"></line>
            </svg>
            Logout
          </button>
        </div>
      </motion.div>

      {/* Logo Flip */}
      <motion.div
        className="pt-6 flex justify-center z-10 relative"
        animate={{ rotateY: flip ? 180 : 0 }}
        transition={{ duration: 1.2 }}
        style={{ perspective: 1000 }}
      >
        <motion.div className="w-[160px] h-[60px] [transform-style:preserve-3d]" animate={{ rotateY: flip ? 180 : 0 }}>
          <motion.div className="absolute w-full h-full backface-hidden" style={{ backfaceVisibility: "hidden" }}>
            <Image src={prorepLogo} alt="ProRep Logo" width={160} height={60} className="rounded" />
          </motion.div>
          <motion.div className="absolute w-full h-full backface-hidden flex items-center justify-center text-xl font-bold text-blue-800" style={{ transform: "rotateY(180deg)", backfaceVisibility: "hidden" }}>
            ProRep by CCDR
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Submission Form */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 max-w-3xl mx-auto bg-white px-6 sm:px-8 py-10 rounded-3xl shadow-xl mt-6 backdrop-blur-sm"
      >
        <h1 className="text-3xl sm:text-4xl font-bold text-center text-blue-800 mb-8">
          Submit Problem Statement
        </h1>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <input type="text" placeholder="Project Title" className="form-input" />
            <input type="text" placeholder="Domain" className="form-input" />
            <textarea placeholder="Broad Problem Statement" rows={4} className="form-textarea" />
          </div>

          <div className="space-y-2">
            <label className="form-label">Select Departments</label>
            <div className="grid sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto border border-gray-300 rounded-lg p-3">
              {dtuDepartments.map((dept, i) => (
                <label key={i} className="flex items-center space-x-2 text-sm">
                  <input type="checkbox" checked={selectedDepartments.includes(dept)} onChange={() => toggleDepartment(dept)} className="accent-blue-600" />
                  <span>{dept}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="form-label">Tags / Keywords</label>
            {keywords.map((tag, i) => (
              <div key={i} className="flex items-center gap-2 mb-1">
                <input type="text" placeholder={`Keyword ${i + 1}`} value={tag} onChange={(e) => updateKeyword(i, e.target.value)} className="form-input flex-1" />
                {keywords.length > 1 && (
                  <button type="button" onClick={() => removeKeyword(i)} className="text-red-500 text-xs">✕</button>
                )}
              </div>
            ))}
            <button type="button" onClick={addKeyword} className="text-blue-600 text-sm hover:underline">+ Add Keyword</button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input type="text" placeholder="Problem Source" className="form-input" />
            <input type="url" placeholder="Source Link" className="form-input" />
            <input type="text" placeholder="Relevant Organisation" className="form-input" />
          </div>

          <textarea placeholder="Additional Notes (Optional)" rows={3} className="form-textarea" />
          <button type="submit" className="w-full bg-blue-700 text-white font-semibold py-3 rounded-lg hover:bg-blue-800 transition">Submit</button>
        </form>
      </motion.div>

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
