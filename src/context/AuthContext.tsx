"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, sendPasswordResetEmail, fetchSignInMethodsForEmail } from "firebase/auth";
import { auth } from "../firebase/firebase";

const AuthContext = createContext<any>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<any>(null);

  // Check if email exists
  const checkEmailExists = async (email: string) => {
    try {
      const methods = await fetchSignInMethodsForEmail(auth, email);
      return methods.length > 0;
    } catch (error) {
      console.error("Error checking email:", error);
      return false;
    }
  };

  // Password reset function
  const forgotPassword = async (email: string) => {
    try {
      await sendPasswordResetEmail(auth, email);
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, forgotPassword, checkEmailExists }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
