"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase/firebase";
import Image from "next/image";
import { toast } from "react-hot-toast";
import prorepLogo from "../../assets/prorep-logo.png";
import { useRouter } from "next/navigation";

export default function ViewDetailsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pid = searchParams.get("pid");
  const [problem, setProblem] = useState<any>(null);

  useEffect(() => {
    const fetchProblem = async () => {
      if (!pid) return toast.error("Invalid problem ID");

      try {
        const docRef = doc(db, "problems", pid);
        const docSnap = await getDoc(docRef);

        if (!docSnap.exists()) {
          toast.error("Problem not found");
          return;
        }

        setProblem({ id: docSnap.id, ...docSnap.data() });
      } catch (error) {
        console.error("Error fetching problem:", error);
        toast.error("Failed to load problem details.");
      }
    };

    fetchProblem();
  }, [pid]);

  if (!problem)
  {
    toast.error("Could Not Load problem details");
    router.push("/main");
    return null;
  }

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 px-4 pt-12 sm:pt-16 overflow-hidden">
      {/* Blurred background circles */}
      <div className="absolute -top-40 -left-32 w-[300px] h-[300px] bg-purple-300 rounded-full blur-[160px] opacity-30 z-0" />
      <div className="absolute -bottom-40 -right-32 w-[300px] h-[300px] bg-blue-300 rounded-full blur-[160px] opacity-30 z-0" />
      <div className="absolute top-0 left-0 w-1/4 h-1/2 bg-blue-900 rounded-br-full z-0" />

      <div className="relative z-10 max-w-4xl w-full mx-auto bg-white rounded-3xl shadow-xl p-6 sm:p-10">
        {/* Header */}
        <div className="text-center mb-8">
          <Image src={prorepLogo} alt="ProRep Logo" width={160} height={60} className="mx-auto" />
          <h1 className="text-3xl sm:text-4xl font-bold text-blue-800 mt-4">
            {problem.title}
          </h1>
          <p className="text-sm text-gray-500 mt-1">Comprehensive Problem Overview</p>
        </div>

        {/* Metadata Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-x-10 sm:gap-y-4 text-sm sm:text-base text-gray-800 mb-8">
          <div>
            <span className="font-semibold text-blue-700">Domain:</span> {problem.domain || "N/A"}
          </div>
          <div>
            <span className="font-semibold text-blue-700">Organisation:</span> {problem.organisation || "N/A"}
          </div>
          <div>
            <span className="font-semibold text-blue-700">Department(s):</span>{" "}
            {problem.departments?.join(", ") || "N/A"}
          </div>
          <div>
            <span className="font-semibold text-blue-700">Keywords:</span>{" "}
            {problem.keywords?.join(", ") || "None"}
          </div>
          <div className="col-span-2">
            <span className="font-semibold text-blue-700">Source:</span> {problem.source || "N/A"}
          </div>
          <div className="col-span-2">
            <span className="font-semibold text-blue-700">Source Link:</span>{" "}
            <a
              href={problem.sourceLink}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline break-all"
            >
              {problem.sourceLink || "N/A"}
            </a>
          </div>
        </div>

        {/* Statement Section */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-blue-800 mb-2">Problem Statement</h2>
          <p className="text-gray-700 whitespace-pre-line bg-blue-50 rounded-lg p-4 border border-blue-100">
            {problem.statement || "No problem statement provided."}
          </p>
        </div>

        {/* Notes Section */}
        <div>
          <h2 className="text-xl font-semibold text-blue-800 mb-2">Additional Notes</h2>
          <p className="text-gray-700 whitespace-pre-line bg-purple-50 rounded-lg p-4 border border-purple-100">
            {problem.notes || "No additional notes provided."}
          </p>
        </div>
      </div>
    </div>
  );
}
