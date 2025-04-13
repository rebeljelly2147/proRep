"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { db } from "../../../firebase/firebase";
import { collection, onSnapshot } from "firebase/firestore";
import { motion } from "framer-motion";
import Image from "next/image";
import prorepLogo from "../../../assets/prorep-logo.png";

export default function BookmarkedPage() {
  const { uid } = useParams();
  const [problems, setProblems] = useState<any[]>([]);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "problems"), (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setProblems(data);
    });
    return () => unsubscribe();
  }, []);

  const bookmarksProblems = problems.filter((p) =>
    p.bookmarks?.includes(uid)
  );

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 py-10 px-4 overflow-x-hidden">
      <div className="absolute -top-40 -left-32 w-[300px] h-[300px] bg-purple-300 rounded-full blur-[160px] opacity-30 z-0" />
      <div className="absolute -bottom-40 -right-32 w-[300px] h-[300px] bg-blue-300 rounded-full blur-[160px] opacity-30 z-0" />
      <div className="absolute top-0 left-0 w-1/4 h-1/2 bg-blue-900 rounded-br-full z-0" />

      <div className="relative z-10 max-w-6xl mx-auto bg-white rounded-3xl shadow-xl p-8">
        <div className="text-center mb-8">
          <Image src={prorepLogo} alt="ProRep Logo" width={160} height={60} className="mx-auto" />
          <h1 className="text-3xl sm:text-4xl font-bold text-blue-800 mt-4">
            Bookmarked Problems
          </h1>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {bookmarksProblems.length === 0 ? (
            <p className="text-center text-gray-500 italic col-span-full">No bookmarks problems yet.</p>
          ) : (
            bookmarksProblems.map((problem) => (
              <motion.div key={problem.id} whileHover={{ scale: 1.02 }} className="bg-blue-50 p-4 rounded-xl border border-blue-100 shadow-sm">
                <h3 className="text-lg font-bold text-blue-800 mb-1">{problem.title}</h3>
                <p className="text-sm text-gray-500 mb-2">{problem.department || problem.departments?.[0]}</p>
                <p className="text-sm text-gray-600 mb-3 line-clamp-3">{problem.statement}</p>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}