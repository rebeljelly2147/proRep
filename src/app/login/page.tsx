"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import prorepLogo from "../../assets/prorep-logo.png";
import { motion } from "framer-motion";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "react-hot-toast";
import { auth, db } from "../../firebase/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import Cookies from "js-cookie";


export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleLogin = async (intentRole: string) => {
    
    console.log("Intent Role:", intentRole);
    
    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();
  
    if (!trimmedEmail || !trimmedPassword) {
      toast.error("Please fill in both email and password.");
      return;
    }
  
    const loadingToast = toast.loading("Logging in...");
  
    try {
      const userCredential = await signInWithEmailAndPassword(auth, trimmedEmail, trimmedPassword);
      const user = userCredential.user;
  
      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);
  
      if (!userSnap.exists()) {
        toast.dismiss(loadingToast);
        toast.error("User does not exist.");
        return;
      }
  
      const userData = userSnap.data();
      const actualRole = userData.role;
  
      if (actualRole !== intentRole) {
        toast.dismiss(loadingToast);
        toast.error(`You are not authorized as ${intentRole}.`);
        return;
      }
      
      Cookies.set("uid", user.uid, { expires: 30 }); // Set uid cookie for 30 days
      Cookies.set("user", JSON.stringify(user), { expires: 30 }); // Set user cookie for 30 days
      Cookies.set("userRole", actualRole, { expires: 30 }); // Set cookie for 30 days
      toast.success(`Welcome ${actualRole}!`, { id: loadingToast });

      if (actualRole === "admin") {
        router.push("/dashboard");
        toast.success("Contribute to the community!");
      } else {
        router.push("/main");
        toast.success("Solve What Matters!");
      }
    } catch (error: any) {
      console.error("Login error:", error);
      toast.error(`Login failed: ${error.message}`);
      toast.dismiss(loadingToast);
      toast.error("Invalid email or password");
    }finally {
      setEmail("");
      setPassword("");
      setShowPassword(false);
    }
  };
  

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

        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-2 text-gray-800">Welcome Back! 👋</h2>
        <p className="text-center text-sm text-gray-500 mb-6">Login to access your account</p>

        <form onSubmit={(e) => e.preventDefault()}>
          <input
            type="email"
            placeholder="Email"
            className="w-full px-4 py-2 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <div className="relative mb-4">
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

          <div 
            className="text-right text-xs text-blue-600 mb-4 cursor-pointer hover:underline"
            onClick={() => router.push("/forgot-password")}
          >
            Forgot password?
          </div>

          <div className="flex gap-4 mb-4">
            <button
              type="submit"
              className="cursor-pointer w-1/2 px-6 py-2 bg-white text-blue-700 border border-blue-500 rounded-lg text-sm font-semibold hover:bg-blue-500 hover:text-white transition-colors duration-100"
              onClick={() =>{
                handleLogin("student");
              }}
            >
              Student
            </button>
            <button
              type="submit"
              className="cursor-pointer w-1/2 px-6 py-2 bg-white text-purple-700 border border-purple-500 rounded-lg text-sm font-semibold hover:bg-purple-500 hover:text-white transition-colors duration-100"
              onClick={() => {
                handleLogin("admin");
              }}
            >
              Admin
            </button>
          </div>

          <p className="text-center text-sm text-gray-600 mt-4">
            Don’t have an account? {" "}
            <button
              type="button"
              onClick={() => router.push("/signup")}
              className="text-blue-600 font-medium underline cursor-pointer"
            >
              Sign up
            </button>
          </p>
        </form>
      </motion.div>
    </div>
  );
}
