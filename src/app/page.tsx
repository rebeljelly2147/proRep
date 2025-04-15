"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Image from "next/image";
import prorepLogo from "../assets/prorep-logo.png";
import LogoutButton from "@/components/LogoutButton";
import { useAuth } from "@/context/AuthContext";
import { toast } from "react-hot-toast";

export default function Home() {
  const router = useRouter();
  const { user, logout } = useAuth();

  // Add near the top of your component
  console.log("Authentication state:", user);

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-[#e0f2fe] to-[#ede9fe] overflow-hidden flex flex-col">
      {/* Background Blobs */}
      <div className="absolute top-[-100px] left-[-120px] w-[300px] h-[300px] bg-blue-300 rounded-full blur-[100px] opacity-30 z-0" />
      <div className="absolute bottom-[-100px] right-[-100px] w-[250px] h-[250px] bg-purple-300 rounded-full blur-[100px] opacity-40 z-0" />

      {/* Quarter-circle top-right */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-blue-900 rounded-bl-[80px] z-0" />

      {/* Fixed Logout Button - Only show when user is logged in */}
      {user && (
        <div className="fixed top-4 right-4 z-50">
          <LogoutButton variant="secondary" className="shadow-md" />
        </div>
      )}

      {/* Temporary test button */}
      <div className="fixed top-4 right-4 z-50">
        <LogoutButton variant="secondary" className="shadow-md" />
      </div>

      {/* Visible debug element */}
      <div className="fixed top-20 left-4 bg-white p-2 rounded shadow z-50 text-xs">
        Auth status: {user ? "Logged in" : "Not logged in"}
      </div>

      {/* Logout button */}
      <button
        className="fixed top-4 right-4 z-50 bg-red-500 text-white p-2 rounded-md shadow-md hover:bg-red-600"
        onClick={async () => {
          try {
            await logout();
            toast.success("Successfully logged out");
            router.push("/login");
          } catch (error) {
            toast.error("Failed to log out");
          }
        }}
      >
        Logout
      </button>

      {/* Logo Header */}
      <div className="w-full text-center py-6 z-10">
        <Image
          src={prorepLogo}
          alt="ProRep logo"
          className="mx-auto"
          width={180}
          height={70}
          priority
        />
      </div>

      {/* Main Content */}
      <main className="flex flex-1 flex-col justify-center items-center px-6 text-center z-10">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="text-lg sm:text-xl text-gray-800 max-w-xl mb-10 font-medium"
        >
          Solve what matters. Empower real change with ProRep.
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 sm:gap-6"
        >
          {!user ? (
            <>
              <button
                onClick={() => router.push("/login")}
                className="px-6 py-2 sm:px-7 sm:py-2.5 bg-white text-blue-700 border border-blue-500 rounded-lg text-sm sm:text-base font-medium transition-colors duration-300 hover:bg-blue-50 cursor-pointer"
              >
                Login
              </button>

              <button
                onClick={() => router.push("/signup")}
                className="px-6 py-2 sm:px-7 sm:py-2.5 bg-white text-green-700 border border-green-500 rounded-lg text-sm sm:text-base font-medium transition-colors duration-300 hover:bg-green-50 cursor-pointer"
              >
                Sign Up
              </button>
            </>
          ) : (
            <LogoutButton variant="primary" className="min-w-[120px]" />
          )}
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 mt-20">
        {/* Background semicircle */}
        <div className="absolute inset-x-0 bottom-0 h-40 bg-blue-900 rounded-t-full z-0" />

        {/* Footer content */}
        <div className="relative z-10 flex flex-col items-center text-center text-white py-6">
          <p className="text-md sm:text-base font-semibold mb-3">
            ProRep by CCDR, DTU
          </p>
          <div className="flex gap-3">
            <div
              className="w-6 h-6 sm:w-8 sm:h-8 rounded-full"
              style={{
                background: "radial-gradient(circle at 30% 30%, #60a5fa, #3b82f6)",
              }}
              title="ProRep"
            />
            <div
              className="w-6 h-6 sm:w-8 sm:h-8 rounded-full"
              style={{
                background: "radial-gradient(circle at 30% 30%, #a78bfa, #7c3aed)",
              }}
              title="CCDR"
            />
            <div
              className="w-6 h-6 sm:w-8 sm:h-8 rounded-full"
              style={{
                background: "radial-gradient(circle at 30% 30%, #38bdf8, #0ea5e9)",
              }}
              title="DTU"
            />
          </div>
        </div>
      </footer>
    </div>
  );
}
