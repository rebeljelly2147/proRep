"use client";

import { use, useEffect, useState } from "react";
import { db, auth } from "../../firebase/firebase";
import {
  collection,
  updateDoc,
  doc,
  onSnapshot,
} from "firebase/firestore";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Menu, X, Bookmark, Star } from "lucide-react";
import prorepLogo from "../../assets/prorep-logo.png";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { getDocs } from "firebase/firestore";

const departments = [
  "Applied Chemistry", "Applied Mathematics", "Applied Physics", "Biotechnology",
  "Civil Engineering", "Computer Engineering", "Design", "Electrical Engineering",
  "Electronics & Communication", "Environmental Engineering", "Information Technology",
  "Mechanical Engineering", "Polymer Science", "Production & Industrial",
  "Software Engineering", "Management", "Economics",
];

export default function StudentProblems() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const role = Cookies.get("userRole");
    if (role !== "student") {
      toast.error("Unauthorized access. Redirecting...");
      router.push("/");
    } else {
      setIsLoading(false);
    }
  }, []);

  const [selectedDept, setSelectedDept] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [flip, setFlip] = useState(false);
 interface Problem {
    id: string;
    title?: string | null;
    department?: string | null;
    description?: string | null;
    statement?: string | null;
    bookmarks?: string[] | null;
    interested?: string[] | null;
    departments?: string[] | null;
  }
  const [problems, setProblems] = useState<Problem[]>([]);
  const [user, setUser] = useState<any>(null);
  const [currentStudent,setCurrentStudent]=useState<any>(null);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "problems"), (snapshot) => {
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as Problem[];
      setProblems(data);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const currentUser = auth.currentUser;
    if (currentUser) {
      setUser(currentUser);
    } else {
      const uid = Cookies.get("uid");
      if (uid) {
        setUser({ uid: uid });
      }
    }
  }, []);

  useEffect(() => {
    const interval = setInterval(() => setFlip((prev) => !prev), 5000);
    return () => clearInterval(interval);
  }, []);

  const handleToggle = async (
    id: string,
    field: "bookmarks" | "interested"
  ) => {
    if (!user) return toast.error("Please login to continue");
    const updatedProblem = problems.find((p) => p.id === id);
    if (!updatedProblem) return;

    const currentArray = updatedProblem[field] || [];
    const updatedArray = currentArray.includes(user.uid)
      ? currentArray.filter((uid: string) => uid !== user.uid)
      : [...currentArray, user.uid];

    try {
      await updateDoc(doc(db, "problems", id), { [field]: updatedArray });
      toast.success("Problem updated successfully!");
    } catch (error: any) {
      console.error("Error updating document: ", error);
      toast.error(`Failed to update problem: ${error.message}`);
    }


  };

  const handleToggleBookmark=async(id:string)=>{
    const querySnapshot=await getDocs(collection(db, "users"));
    const AllUsers = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    console.log("All Users:", AllUsers);
    const currentUser = AllUsers.find(u => u.id === user.uid);
    
    if(!currentUser)
      {
        toast.error("Session Expired!");
        router.push("/");
        return;
      }
    setCurrentStudent(currentUser);
    const bookMarkArray=currentUser.bookmarks;

    if(bookMarkArray.includes(id)){
      const updatedArray=bookMarkArray.filter((uid:string)=>uid!==id);
      await updateDoc(doc(db, "users", user.uid), { bookmarks: updatedArray });
      toast.success("Bookmark removed successfully!");
    }
    else
    {
      const updatedArray=[...bookMarkArray, id];
      await updateDoc(doc(db, "users", user.uid), { bookmarks: updatedArray });
      toast.success("Bookmark added successfully!");
    }

  }

  const handleToggleInterested=async(id:string)=>{
    const querySnapshot=await getDocs(collection(db, "users"));
    const AllUsers = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    console.log("All Users:", AllUsers);
    const currentUser = AllUsers.find(u => u.id === user.uid);
    
    if(!currentUser)
    {
      toast.error("Session Expired!");
      router.push("/");
      return;
    }

    setCurrentStudent(currentUser);
    const interestedArray=currentUser.interested;

    if(interestedArray.includes(id)){
      const updatedArray=interestedArray.filter((uid:string)=>uid!==id);
      await updateDoc(doc(db, "users", user.uid), { interested: updatedArray });
      toast.success("Interest removed successfully!");
    }
    else
    {
      const updatedArray=[...interestedArray, id];
      await updateDoc(doc(db, "users", user.uid), { interested: updatedArray });
      toast.success("Interest added successfully!");
    }
  }

  const filteredProblems = selectedDept
    ? problems.filter((p) => p.departments?.includes(selectedDept))
    : problems;

  const navItems = [
    {
      name: "Interested",
      icon: <Star size={18} />,
      path: user ? `/interested?uid=${user.uid}` : "#",
    },
    {
      name: "Bookmarked",
      icon: <Bookmark size={18} />,
      path: user ? `/bookmarked?uid=${user.uid}` : "#",
    },
  ];

  if (isLoading) return null;

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 overflow-hidden pb-32">
      {/* Background */}
      <div className="absolute -top-40 -left-32 w-[300px] h-[300px] bg-purple-300 rounded-full blur-[160px] opacity-30 z-0" />
      <div className="absolute -bottom-40 -right-32 w-[300px] h-[300px] bg-blue-300 rounded-full blur-[160px] opacity-30 z-0" />
      <div className="absolute top-0 left-0 w-24 h-24 bg-blue-900 rounded-br-full z-0" />

      {/* Sidebar */}
      <button
        className="fixed top-4 left-4 z-50 bg-blue-700 text-white p-2 rounded-md shadow-md"
        onClick={() => setSidebarOpen(true)}
      >
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
          <button onClick={() => setSidebarOpen(false)} className="cursor-pointer">
            <X size={22} />
          </button>
        </div>
        {navItems.map((item, i) => (
          <Link
            key={i}
            href={item.path}
            className="flex items-center gap-3 px-3 py-2 text-sm rounded-md hover:bg-blue-100 text-gray-700 transition-all"
          >
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
        <motion.div
          className="w-[160px] h-[60px] [transform-style:preserve-3d]"
          animate={{ rotateY: flip ? 180 : 0 }}
        >
          <motion.div
            className="absolute w-full h-full backface-hidden"
            style={{ backfaceVisibility: "hidden" }}
          >
            <Image src={prorepLogo} alt="ProRep Logo" width={160} height={60} />
          </motion.div>
          <motion.div
            className="absolute w-full h-full backface-hidden flex items-center justify-center text-xl font-bold text-blue-800"
            style={{ transform: "rotateY(180deg)", backfaceVisibility: "hidden" }}
          >
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
            <option key={i} value={dept}>
              {dept}
            </option>
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
            <h3 className="text-lg font-semibold text-blue-800 mb-1">
              {problem.title}
            </h3>
            <p className="text-sm text-gray-500 mb-2">
              {problem.department || problem.departments?.[0]}
            </p>
            <p className="text-sm text-gray-600 mb-3 line-clamp-3">
              {problem.description || problem.statement}
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  console.log("User:", user);
                  handleToggle(problem.id, "bookmarks");
                  handleToggleBookmark(problem.id);
                }}
                className={`px-3 py-1 border text-xs rounded transition cursor-pointer ${
                  problem.bookmarks?.includes(user?.uid ?? "")
                    ? "bg-blue-100 border-blue-600 text-blue-800"
                    : "border-blue-500 text-blue-600 hover:bg-blue-50"
                }`}
              >
                Bookmark
              </button>
              <button
                onClick={() => {
                  console.log("User:", user);
                  handleToggle(problem.id, "interested");
                  handleToggleInterested(problem.id);
                }}
                className={`px-3 py-1 border text-xs rounded transition cursor-pointer ${
                  problem.interested?.includes(user?.uid ?? "")
                    ? "bg-purple-100 border-purple-600 text-purple-800"
                    : "border-purple-500 text-purple-600 hover:bg-purple-50"
                }`}
              >
                Interested
              </button>
              <Link
                href={`/details?pid=${problem.id}`}
                className="ml-auto text-blue-600 text-xs hover:underline"
              >
                View Details
              </Link>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Footer */}
      <footer className="absolute bottom-0 w-full bg-blue-900 text-white py-6 px-4">
        <div className="flex flex-col items-center relative z-10">
          <p className="text-sm sm:text-base font-semibold mb-3">
            ProRep by CCDR, DTU
          </p>
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
