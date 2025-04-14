"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase/firebase";
import Image from "next/image";
import { toast } from "react-hot-toast";
import prorepLogo from "../../assets/prorep-logo.png";
import { useRouter } from "next/navigation";

export default function DetailsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pid = searchParams.get("pid");
  const [problem, setProblem] = useState<{
    id: string | null;
    title: string | null;
    domain: string | null;
    organisation: string | null;
    departments: string[] | null;
    keywords: string[] | null;
    source: string | null;
    sourceLink: string | null;
    statement: string | null;
    notes: string | null;
  } | null>(null);

  useEffect(() => {
    const fetchProblem = async () => {
      console.log("Fetching problem with ID:", pid);
      if (!pid) return toast.error("Invalid problem ID");

      try {
        const docRef = doc(db, "problems", pid);
        const docSnap = await getDoc(docRef);
        console.log("Document snapshot:", docSnap.exists(), docSnap.data());

        if (!docSnap.exists()) {
          toast.error("Problem not found");
          return;
        }

        const problemData = docSnap.data() as {
          title?: string;
          domain?: string;
          organisation?: string;
          departments?: string[];
          keywords?: string[];
          source?: string;
          sourceLink?: string;
          statement?: string;
          notes?: string;
        };
        if (!problemData) {
          toast.error("Problem data is missing");
          return;
        }

        setProblem({
          id: docSnap.id,
          title: problemData.title || null,
          domain: problemData.domain || null,
          organisation: problemData.organisation || null,
          departments: problemData.departments || null,
          keywords: problemData.keywords || null,
          source: problemData.source || null,
          sourceLink: problemData.sourceLink || null,
          statement: problemData.statement || null,
          notes: problemData.notes || null,
        });
      } catch (error: any) {
        console.error("Error fetching problem:", error);
        toast.error(`Failed to load problem details: ${error.message}`);
      }
    };

    fetchProblem();
  }, [pid]);

  // useEffect(() => {
  //   if (!problem) {
  //     console.error("Problem details not found");
      
  //     toast.error("Could Not Load problem details");
  //     router.push("/main");
  //   }
  // }, [problem, router]);

  if (!problem) {
    return null;
  }

  return (
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
          <span className="font-semibold text-blue-700">Domain:</span> {problem?.domain ? problem.domain : "N/A"}
        </div>
        <div>
          <span className="font-semibold text-blue-700">Organisation:</span> {problem?.organisation ? problem.organisation : "N/A"}
        </div>
        <div>
          <span className="font-semibold text-blue-700">Department(s):</span> {problem?.departments ? problem.departments.join(", ") : "N/A"}
        </div>
        <div>
          <span className="font-semibold text-blue-700">Keywords:</span> {problem?.keywords ? problem.keywords.join(", ") : "None"}
        </div>
        <div className="col-span-2">
          <span className="font-semibold text-blue-700">Source:</span> {problem?.source ? problem.source : "N/A"}
        </div>
        <div className="col-span-2">
          <span className="font-semibold text-blue-700">Source Link:</span>{" "}
          <a
            href={problem?.sourceLink ? problem.sourceLink : ""}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline break-all"
          >
            {problem?.sourceLink ? problem.sourceLink : "N/A"}
          </a>
        </div>
      </div>

      {/* Statement Section */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-blue-800 mb-2">Problem Statement</h2>
        <p className="text-gray-700 whitespace-pre-line bg-blue-50 rounded-lg p-4 border border-blue-100">
          {problem?.statement ? problem.statement : "No problem statement provided."}
        </p>
      </div>

      {/* Notes Section */}
      <div>
        <h2 className="text-xl font-semibold text-blue-800 mb-2">Additional Notes</h2>
        <p className="text-gray-700 whitespace-pre-line bg-purple-50 rounded-lg p-4 border border-purple-100">
          {problem?.notes ? problem.notes : "No additional notes provided."}
        </p>
      </div>
    </div>
  );
}
