"use client";

import { useEffect, useState } from "react";
import { auth, db } from "../../../firebase/firebase";
import {
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  doc,
  deleteDoc,
} from "firebase/firestore";
import { EmailAuthProvider, reauthenticateWithCredential, onAuthStateChanged } from "firebase/auth";
import { Eye, EyeOff, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function AdminProfilePage() {
  const router = useRouter();

  const [user, setUser] = useState<any>(null);
  const [problems, setProblems] = useState<any[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [title, setTitle] = useState("Problem Curator");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        toast.error("Session expired. Please login again.");
        router.push("/");
        return;
      }

      setUser(currentUser);

      const q = query(
        collection(db, "problems"),
        where("createdBy.uid", "==", currentUser.uid)
      );
      const querySnapshot = await getDocs(q);
      const problemsData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setProblems(problemsData);
    });

    return () => unsubscribe();
  }, [router]);

  const handleSaveEdit = async (problemId: string, updatedProblem: any) => {
    if (!user) return;

    try {
      const credential = EmailAuthProvider.credential(user.email, password);
      await reauthenticateWithCredential(user, credential);

      await updateDoc(doc(db, "problems", problemId), updatedProblem);
      toast.success("Problem updated successfully.");
      setEditingId(null);
    } catch (err: any) {
      console.error(err);
      toast.error("Authentication failed. Check your password.");
    }
  };

  const handleDelete = async (problemId: string) => {
    try {
      await deleteDoc(doc(db, "problems", problemId));
      setProblems((prev) => prev.filter((p) => p.id !== problemId));
      toast.success("Problem deleted successfully.");
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete the problem.");
    }
  };

  return (
    <div className="relative min-h-screen max-h-screen overflow-y-auto bg-gradient-to-br from-[#f0f9ff] to-[#ede9fe] py-10 px-4 overflow-x-hidden">
      <div className="absolute -top-40 -left-32 w-[300px] h-[300px] bg-purple-300 rounded-full blur-[160px] opacity-30 z-0" />
      <div className="absolute -bottom-40 -right-32 w-[300px] h-[300px] bg-blue-300 rounded-full blur-[160px] opacity-30 z-0" />

      <div className="max-w-5xl mx-auto bg-white rounded-3xl shadow-xl p-8 relative z-10">
        <h1 className="text-3xl sm:text-4xl font-bold text-blue-800 text-center mb-6 cursor-pointer">
          Hello, {user?.email?.split("@")[0]} 👋
        </h1>

        <div className="mb-6 text-center">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Custom Title"
            className="text-lg font-semibold text-center border-b border-gray-300 outline-none cursor-pointer"
          />
        </div>

        <h2 className="text-xl font-semibold text-gray-700 mb-4 cursor-pointer">
          Your Submitted Problems
        </h2>
        {problems.length === 0 ? (
          <p className="text-sm text-gray-500 italic">No problems submitted yet.</p>
        ) : (
          <div className="grid gap-4">
            {problems.map((problem) => (
              <div
                key={problem.id}
                className="p-4 bg-blue-50 rounded-xl border border-blue-100 shadow-sm"
              >
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-lg font-bold text-blue-800 cursor-pointer">
                    {problem.title}
                  </h3>
                  <div className="flex gap-2">
                    <button
                      onClick={() =>
                        setEditingId(editingId === problem.id ? null : problem.id)
                      }
                      className="text-sm text-blue-600 hover:underline cursor-pointer"
                    >
                      {editingId === problem.id ? "Cancel" : "Edit"}
                    </button>
                    <button
                      onClick={() => handleDelete(problem.id)}
                      className="text-red-500 cursor-pointer"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>

                {editingId === problem.id ? (
                  <>
                    <input
                      type="text"
                      defaultValue={problem.title}
                      onChange={(e) => (problem.title = e.target.value)}
                      className="form-input w-full mb-2 cursor-pointer"
                      placeholder="Title"
                    />
                    <input
                      type="text"
                      defaultValue={problem.domain}
                      onChange={(e) => (problem.domain = e.target.value)}
                      className="form-input w-full mb-2 cursor-pointer"
                      placeholder="Domain"
                    />
                    <textarea
                      className="form-textarea w-full mb-2 cursor-pointer"
                      defaultValue={problem.statement}
                      placeholder="Edit problem statement"
                      onChange={(e) => (problem.statement = e.target.value)}
                    />
                    <input
                      type="text"
                      defaultValue={problem.source}
                      onChange={(e) => (problem.source = e.target.value)}
                      className="form-input w-full mb-2 cursor-pointer"
                      placeholder="Source"
                    />
                    <input
                      type="text"
                      defaultValue={problem.sourceLink}
                      onChange={(e) => (problem.sourceLink = e.target.value)}
                      className="form-input w-full mb-2 cursor-pointer"
                      placeholder="Source Link"
                    />
                    <input
                      type="text"
                      defaultValue={problem.organisation}
                      onChange={(e) => (problem.organisation = e.target.value)}
                      className="form-input w-full mb-2 cursor-pointer"
                      placeholder="Organisation"
                    />
                    <textarea
                      className="form-textarea w-full mb-2 cursor-pointer"
                      defaultValue={problem.notes}
                      placeholder="Additional Notes"
                      onChange={(e) => (problem.notes = e.target.value)}
                    />

                    <div className="relative mb-3">
                      <input
                        type={showPassword ? "text" : "password"}
                        placeholder="Confirm your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="form-input pr-10 w-full cursor-pointer"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-2 top-2 text-gray-500 cursor-pointer"
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>

                    <button
                      onClick={() => handleSaveEdit(problem.id, problem)}
                      className="bg-blue-600 text-white py-2 px-4 rounded-lg text-sm hover:bg-blue-700 transition cursor-pointer"
                    >
                      Save Changes
                    </button>
                  </>
                ) : (
                  <p className="text-sm text-gray-700 whitespace-pre-line cursor-pointer">
                    {problem.statement}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}