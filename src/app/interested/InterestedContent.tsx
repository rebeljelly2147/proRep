"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import { db } from "../../firebase/firebase";
import { toast } from "react-hot-toast";
import { motion } from "framer-motion";

interface Problem {
  id: string;
  title: string;
  department?: string;
  departments?: string[];
  statement: string;
}

export default function InterestedContent() {
  const searchParams = useSearchParams();
  const uid = searchParams.get("uid");
  const [problems, setProblems] = useState<Problem[]>([]);

  useEffect(() => {
    const fetchInterestedProblems = async () => {
      if (!uid) return toast.error("Invalid User ID");

      try {
        const userRef = doc(db, "users", uid);
        const userSnap = await getDoc(userRef);

        if (!userSnap.exists()) return toast.error("User not found");

        const interestedIds = userSnap.data().interested || [];

        const problemsSnapshot = await getDocs(collection(db, "problems"));
        const allProblems = problemsSnapshot.docs.map((d) => {
          const problemData = d.data();
          return {
            id: d.id,
            title: problemData.title || "",
            department: problemData.department,
            departments: problemData.departments,
            statement: problemData.statement || "",
          };
        });
        const filtered = allProblems.filter((p) => interestedIds.includes(p.id));
        setProblems(filtered as Problem[]);
      } catch (err) {
        toast.error("Failed to load interested problems");
        console.error(err);
      }
    };

    fetchInterestedProblems();
  }, [uid]);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {problems.length === 0 ? (
        <p className="text-center text-gray-500 italic col-span-full">No interested problems yet.</p>
      ) : (
        problems.map((p) => (
          <motion.div key={p.id} whileHover={{ scale: 1.02 }} className="bg-purple-50 p-4 rounded-xl border border-purple-100 shadow-sm">
            <h3 className="text-lg font-bold text-purple-800 mb-1">{p.title}</h3>
            <p className="text-sm text-gray-500 mb-2">{p.department || p.departments?.[0]}</p>
            <p className="text-sm text-gray-600 mb-3 line-clamp-3">{p.statement}</p>
          </motion.div>
        ))
      )}
    </div>
  );
}
