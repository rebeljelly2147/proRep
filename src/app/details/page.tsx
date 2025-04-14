"use client";

import { Suspense } from "react";
import DetailsContent from "./DetailsContent";

export default function ViewDetailsPage() {
  return (
    <div className="relative min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 px-4 pt-12 sm:pt-16 overflow-hidden">
      {/* Blurred background circles */}
      <div className="absolute -top-40 -left-32 w-[300px] h-[300px] bg-purple-300 rounded-full blur-[160px] opacity-30 z-0" />
      <div className="absolute -bottom-40 -right-32 w-[300px] h-[300px] bg-blue-300 rounded-full blur-[160px] opacity-30 z-0" />
      <div className="absolute top-0 left-0 w-1/4 h-1/2 bg-blue-900 rounded-br-full z-0" />

      <Suspense fallback={<p>Loading details...</p>}>
        <DetailsContent />
      </Suspense>
    </div>
  );
}
