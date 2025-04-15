"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { forgotPassword, checkEmailExists } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      toast.error("Please enter your email address.");
      return;
    }

    setIsLoading(true);
    const loadingToast = toast.loading("Checking email...");

    try {
      // First check if email exists
      const exists = await checkEmailExists(email.trim());
      
      if (!exists) {
        toast.dismiss(loadingToast);
        toast.error("This email does not exist in our records.");
        setIsLoading(false);
        return;
      }
      
      toast.dismiss(loadingToast);
      const sendingToast = toast.loading("Sending reset link...");
      
      const result = await forgotPassword(email.trim());
      if (result.success) {
        toast.dismiss(sendingToast);
        toast.success("Password reset email sent! Check your inbox.");
      } else {
        toast.dismiss(sendingToast);
        toast.error(`Error: ${result.error}`);
      }
    } catch (error) {
      toast.dismiss(loadingToast);
      toast.error("Failed to process your request. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        placeholder="Email"
        className="w-full px-4 py-2 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
        
      <button 
        type="submit"
        disabled={isLoading}
        className="w-full px-6 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors duration-100 disabled:bg-blue-400"
      >
        {isLoading ? "Processing..." : "Send Reset Link"}
      </button>
      
      <p className="text-center text-sm text-gray-600 mt-4">
        Remember your password?{" "}
        <button
          type="button"
          onClick={() => router.push("/login")}
          className="text-blue-600 font-medium underline cursor-pointer"
        >
          Back to login
        </button>
      </p>
    </form>
  );
}