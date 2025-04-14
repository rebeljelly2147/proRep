"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../../firebase/firebase";
import { motion } from "framer-motion";

interface Problem {
  id: string;
  title: string;
  department?: string;
  departments?: string[];
  statement: string;
  bookmarks?: string[];
}

export default function BookmarkedContent() {
  const searchParams = useSearchParams();
  const uid = searchParams.get("uid");
  const [problems, setProblems] = useState<Problem[]>([]);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "problems"), (snapshot) => {
      const data = snapshot.docs.map((doc) => {
        const problemData = doc.data();
        return {
          id: doc.id,
          title: problemData.title || "",
          department: problemData.department,
          departments: problemData.departments,
          statement: problemData.statement || "",
          bookmarks: problemData.bookmarks,
        };
      });
      setProblems(data as Problem[]);
    });
    return () => unsubscribe();
  }, []);

  const bookmarksProblems = problems.filter((p) => p.bookmarks?.includes(uid || ""));

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {bookmarksProblems.length === 0 ? (
        <p className="text-center text-gray-500 italic col-span-full">No bookmarks yet.</p>
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
  );
}
