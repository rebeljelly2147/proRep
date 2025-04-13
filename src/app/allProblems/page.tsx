"use client";

import { useEffect, useState } from "react";
import { db } from "../../firebase/firebase";
import {
  collection,
  getDocs,
  query,
  updateDoc,
  deleteDoc,
  doc
} from "firebase/firestore";
import { Trash2, Lock, Save } from "lucide-react";
import toast from "react-hot-toast";
import Image from "next/image";
import prorepLogo from "../../assets/prorep-logo.png";

export default function AllProblemsPage() {
  const [problems, setProblems] = useState<any[]>([]);
  const [filters, setFilters] = useState({ keyword: "", department: "", organisation: "" });
  const [authCode, setAuthCode] = useState("");
  const [unlocked, setUnlocked] = useState(false);
  const [editing, setEditing] = useState<Record<string, any>>({});

  useEffect(() => {
    fetchProblems();
  }, [filters]);

  const fetchProblems = async () => {
    try {
      const q = query(collection(db, "problems"));
      const snapshot = await getDocs(q);
      const filtered = snapshot.docs
        .map((doc) => ({ id: doc.id, ...doc.data() }))
        .filter((problem) => {
          const matchesKeyword = filters.keyword
            ? problem.keywords?.some((k: string) => k.toLowerCase().includes(filters.keyword.toLowerCase()))
            : true;
          const matchesDept = filters.department
            ? problem.departments?.includes(filters.department)
            : true;
          const matchesOrg = filters.organisation
            ? problem.organisation?.toLowerCase().includes(filters.organisation.toLowerCase())
            : true;
          return matchesKeyword && matchesDept && matchesOrg;
        });
      setProblems(filtered);
    } catch (error) {
      console.error("Error fetching problems:", error);
      toast.error("Failed to load problems");
    }
  };

  const handleDelete = async (id: string) => {
    if (!unlocked) {
      toast.error("Enter valid access code to delete.");
      return;
    }
    try {
      await deleteDoc(doc(db, "problems", id));
      setProblems((prev) => prev.filter((p) => p.id !== id));
      toast.success("Deleted successfully");
    } catch (error) {
      console.error(error);
      toast.error("Delete failed");
    }
  };

  const handleCodeSubmit = () => {
    if (authCode === process.env.NEXT_PUBLIC_PROBLEM_EDIT_CODE) {
      setUnlocked(true);
      toast.success("Edit/Delete access granted");
    } else {
      toast.error("Invalid access code");
    }
  };

  const handleSave = async (id: string) => {
    try {
      const updatePayload = editing[id];
      if (updatePayload.keywords) {
        updatePayload.keywords = updatePayload.keywords.split(",").map((k: string) => k.trim());
      }
      if (updatePayload.departments) {
        updatePayload.departments = updatePayload.departments.split(",").map((d: string) => d.trim());
      }
      await updateDoc(doc(db, "problems", id), updatePayload);
      toast.success("Problem updated successfully");
      setEditing((prev) => ({ ...prev, [id]: undefined }));
    } catch (err) {
      console.error(err);
      toast.error("Update failed");
    }
  };

  return (
    <div className="relative min-h-screen max-h-screen overflow-y-auto bg-gradient-to-br from-blue-50 to-purple-100 px-4 py-12 overflow-x-hidden">
      <div className="absolute -top-40 -left-32 w-[300px] h-[300px] bg-purple-300 rounded-full blur-[160px] opacity-30 z-0" />
      <div className="absolute -bottom-40 -right-32 w-[300px] h-[300px] bg-blue-300 rounded-full blur-[160px] opacity-30 z-0" />

      <div className="relative z-10 max-w-6xl mx-auto bg-white p-8 rounded-3xl shadow-xl">
        <div className="flex justify-center mb-6">
          <Image src={prorepLogo} alt="ProRep Logo" width={160} height={60} />
        </div>

        <h1 className="text-3xl sm:text-4xl font-bold text-blue-800 mb-6 text-center">All Submitted Problems</h1>

        <div className="grid sm:grid-cols-3 gap-4 mb-8">
          <input type="text" placeholder="Search by keyword" className="form-input w-full" value={filters.keyword} onChange={(e) => setFilters({ ...filters, keyword: e.target.value })} />
          <input type="text" placeholder="Search by department" className="form-input w-full" value={filters.department} onChange={(e) => setFilters({ ...filters, department: e.target.value })} />
          <input type="text" placeholder="Search by organisation" className="form-input w-full" value={filters.organisation} onChange={(e) => setFilters({ ...filters, organisation: e.target.value })} />
        </div>

        <div className="flex items-center gap-4 mb-10">
          <input type="password" placeholder="Enter access code to unlock editing" value={authCode} onChange={(e) => setAuthCode(e.target.value)} className="form-input w-full sm:max-w-xs" />
          <button onClick={handleCodeSubmit} className="bg-blue-600 text-white px-4 py-2 rounded-md flex items-center gap-2 hover:bg-blue-700 transition">
            <Lock size={16} /> Unlock
          </button>
        </div>

        <div className="grid gap-5">
          {problems.map((problem) => (
            <div key={problem.id} className="bg-blue-50 p-5 rounded-xl border border-blue-100 shadow-sm">
              <div className="flex justify-between items-start mb-2">
                {unlocked ? (
                  <input className="font-semibold text-blue-700 w-full bg-transparent border-b border-blue-300 mb-1" defaultValue={problem.title} onChange={(e) => setEditing((prev) => ({ ...prev, [problem.id]: { ...prev[problem.id], title: e.target.value } }))} />
                ) : (
                  <h3 className="text-xl font-semibold text-blue-700">{problem.title}</h3>
                )}

                {unlocked && (
                  <div className="flex gap-2">
                    <button onClick={() => handleDelete(problem.id)} className="text-red-600 hover:text-red-800" title="Delete"><Trash2 size={18} /></button>
                    <button onClick={() => handleSave(problem.id)} className="text-green-600 hover:text-green-800" title="Save"><Save size={18} /></button>
                  </div>
                )}
              </div>

              {unlocked ? (
                <textarea className="form-textarea w-full mb-2" defaultValue={problem.statement} onChange={(e) => setEditing((prev) => ({ ...prev, [problem.id]: { ...prev[problem.id], statement: e.target.value } }))} />
              ) : (
                <p className="text-sm text-gray-700 mb-2 whitespace-pre-line">{problem.statement}</p>
              )}

              <p className="text-xs text-gray-500 mb-1">
                Domain: {unlocked ? (
                  <input defaultValue={problem.domain} className="border-b border-gray-300" onChange={(e) => setEditing((prev) => ({ ...prev, [problem.id]: { ...prev[problem.id], domain: e.target.value } }))} />
                ) : (
                  problem.domain
                )}
              </p>
              <p className="text-xs text-gray-500 mb-1">
                Organisation: {unlocked ? (
                  <input defaultValue={problem.organisation} className="border-b border-gray-300" onChange={(e) => setEditing((prev) => ({ ...prev, [problem.id]: { ...prev[problem.id], organisation: e.target.value } }))} />
                ) : (
                  problem.organisation
                )}
              </p>
              <p className="text-xs text-gray-500 mb-1">
                Departments: {unlocked ? (
                  <input defaultValue={problem.departments?.join(", ")} className="border-b border-gray-300" onChange={(e) => setEditing((prev) => ({ ...prev, [problem.id]: { ...prev[problem.id], departments: e.target.value } }))} />
                ) : (
                  problem.departments?.join(", ")
                )}
              </p>
              <p className="text-xs text-gray-500 mb-1">
                Keywords: {unlocked ? (
                  <input defaultValue={problem.keywords?.join(", ")} className="border-b border-gray-300" onChange={(e) => setEditing((prev) => ({ ...prev, [problem.id]: { ...prev[problem.id], keywords: e.target.value } }))} />
                ) : (
                  problem.keywords?.join(", ")
                )}
              </p>
              <p className="text-xs text-gray-500">Submitted by: {problem.createdBy?.email}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
