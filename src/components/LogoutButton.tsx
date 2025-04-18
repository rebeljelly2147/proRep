"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

interface LogoutButtonProps {
  className?: string;
  variant?: "primary" | "secondary" | "text";
}

export default function LogoutButton({ 
  className = "", 
  variant = "primary" 
}: LogoutButtonProps) {
  const { logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    const loadingToast = toast.loading("Logging out...");
    
    try {
      const result = await logout();
      
      if (result.success) {
        toast.dismiss(loadingToast);
        toast.success("You have successfully logged out.");
        router.push("/login");
      } else {
        toast.dismiss(loadingToast);
        toast.error("Failed to logout. Please try again.");
      }
    } catch (error) {
      toast.dismiss(loadingToast);
      toast.error("An error occurred during logout");
    }
  };

  const getButtonClasses = () => {
    switch(variant) {
      case "primary":
        return "px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors";
      case "secondary":
        return "px-4 py-2 bg-gray-200 text-gray-800 rounded-lg text-sm font-medium hover:bg-gray-300 transition-colors";
      case "text":
        return "text-sm text-blue-600 font-medium hover:underline";
      default:
        return "px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors";
    }
  };

  return (
    <button onClick={handleLogout} className={`${getButtonClasses()} ${className}`}>
      Logout
    </button>
  );
}