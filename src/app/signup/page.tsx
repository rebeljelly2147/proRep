"use client";

import { useState } from "react";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import Image from "next/image";
import prorepLogo from "../../assets/prorep-logo.png";
import { motion } from "framer-motion";
import { Eye, EyeOff } from "lucide-react";
import Cookies from "js-cookie";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../../firebase/firebase";
import { setDoc, doc, serverTimestamp, getDoc } from "firebase/firestore";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [adminCode, setAdminCode] = useState("");
  const router = useRouter();

  const handleSignUp = async (role: "student" | "admin") => {
    const loadingToast = toast.loading("Creating account...");

    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();

    if (!trimmedEmail || !trimmedPassword) {
      toast.dismiss(loadingToast);
      toast.error("Please fill in both email and password.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      toast.dismiss(loadingToast);
      toast.error("Invalid email format.");
      return;
    }

    const isValidAdminCode = adminCode.trim() === process.env.NEXT_PUBLIC_ADMIN_CODE;

    if (role === "admin" && !isValidAdminCode) {
      toast.dismiss(loadingToast);
      toast.error("Invalid admin code.");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, trimmedEmail, trimmedPassword);
      const user = userCredential.user;
      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const existingData = userSnap.data();
        const currentRole = existingData.role;

        if (currentRole !== role) {
          await setDoc(
            userRef,
            {
              ...existingData,
              role: role,
              updatedAt: serverTimestamp(),
            },
            { merge: true }
          );
          toast.success(`Role changed to ${role}`);
        } else {
          toast.success("Logged in with existing role.");
        }
      } else {
        await setDoc(userRef, {
          uid: user.uid,
          email: user.email,
          role: role,
          createdAt: serverTimestamp(),
          bookmarks: [],
          interested: [],
        });

        toast.success(`Signed up successfully as ${role}!`);
      }

      Cookies.set("userRole", role, { expires: 7 });
      toast.dismiss(loadingToast);
      router.push("/main");
    } catch (err: any) {
      console.error("Signup Error:", err);
      toast.dismiss(loadingToast);
      toast.error("Signup failed.");
    }
  };

  const isValidAdminCode = adminCode.trim() === process.env.NEXT_PUBLIC_ADMIN_UUID;

  return (
    <div className="relative min-h-screen w-full bg-gradient-to-br from-[#e0f2fe] to-[#ede9fe] overflow-hidden flex items-center justify-center px-4">
      <div className="absolute top-[-80px] left-[-80px] w-[200px] h-[200px] bg-purple-300 rounded-full blur-[120px] opacity-30 z-0" />

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="bg-white shadow-2xl rounded-3xl p-8 max-w-md w-full relative z-10"
      >
        <div className="flex justify-center mb-6">
          <Image src={prorepLogo} alt="ProRep Logo" width={150} height={50} className="mx-auto" />
        </div>

        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-2 text-gray-800">Create Your Account 👋</h2>
        <p className="text-center text-sm text-gray-500 mb-6">Sign up to get started</p>

        <form onSubmit={(e) => e.preventDefault()} className="flex flex-col gap-4 sm:gap-5">
          <input
            type="email"
            placeholder="Email"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm pr-10"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute top-2 right-3 text-gray-500"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          <input
            type="text"
            placeholder="Admin Code (optional)"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 text-sm"
            value={adminCode}
            onChange={(e) => setAdminCode(e.target.value)}
          />

          {/* Responsive Role Selection Buttons */}
          <div className="grid grid-cols-2 gap-3 mt-2">
            <button
              type="button"
              onClick={() => handleSignUp("student")}
              className="min-h-[42px] text-sm px-4 py-2 rounded-lg font-semibold border bg-blue-500 text-white hover:bg-blue-600 transition text-center cursor-pointer"
            >
              Signup as Student
            </button>

            <button
              type="button"
              onClick={() => handleSignUp("admin")}
              disabled={!isValidAdminCode}
              className={`min-h-[42px] text-sm px-4 py-2 rounded-lg font-semibold border text-center transition duration-10 cursor-pointer${
                isValidAdminCode
                  ? "bg-purple-500 text-white bg-purple-600 cursor-pointer hover:bg-purple-700"
                  : "bg-white text-purple-700 border-purple-500 opacity-50 cursor-not-allowed"
              }`}
            >
              Signup as Admin
            </button>
          </div>

          <p className="text-center text-sm text-gray-600 mt-4">
            Already have an account?{" "}
            <button
              type="button"
              onClick={() => router.push("/login")}
              className="text-blue-600 font-medium underline cursor-pointer"
            >
              Login
            </button>
          </p>
        </form>
      </motion.div>
    </div>
  );
}
