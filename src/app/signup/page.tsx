"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import prorepLogo from "../../assets/prorep-logo.png";
import { motion } from "framer-motion";
import { Eye, EyeOff } from "lucide-react";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

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

        <form>
          <input
            type="email"
            placeholder="Email"
            className="w-full px-4 py-2 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <div className="relative mb-6">
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

          <button
            type="submit"
            className="w-full bg-white text-blue-700 border border-blue-500 text-sm hover:bg-blue-500 hover:text-white transition-colors duration-100 py-2 rounded-lg font-semibold cursor-pointer"
          >
            Sign Up
          </button>

          <p className="text-center text-sm text-gray-600 mt-4">
            Already have an account? {" "}
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
