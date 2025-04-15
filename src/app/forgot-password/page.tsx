"use client";

import ForgotPassword from "@/components/ForgotPassword";
import { motion } from "framer-motion";
import Image from "next/image";
import prorepLogo from "../../assets/prorep-logo.png";

export default function ForgotPasswordPage() {
  return (
    <div className="relative min-h-screen w-full bg-gradient-to-br from-[#e0f2fe] to-[#ede9fe] overflow-hidden flex items-center justify-center px-4">
      <div className="absolute top-[-80px] right-[-80px] w-[200px] h-[200px] bg-blue-300 rounded-full blur-[120px] opacity-30 z-0" />

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="bg-white shadow-2xl rounded-3xl p-8 max-w-md w-full relative z-10"
      >
        <div className="flex justify-center mb-6">
          <Image src={prorepLogo} alt="ProRep Logo" width={150} height={50} className="mx-auto" />
        </div>

        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-2 text-gray-800">Reset Password</h2>
        <p className="text-center text-sm text-gray-500 mb-6">Enter your email to receive a password reset link</p>

        <ForgotPassword />
      </motion.div>
    </div>
  );
}