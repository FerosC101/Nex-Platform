import React from "react";
import Link from "next/link";
import { NexLogo } from "@/components/ui/nex-logo";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col justify-between selection:bg-primary/20 selection:text-primary">
      {/* Top Header */}
      <div className="max-w-7xl mx-auto w-full px-6 py-6 flex items-center justify-between">
        <Link href="/">
          <NexLogo />
        </Link>
        <Link
          href="/"
          className="text-xs text-muted-foreground hover:text-primary transition-colors"
        >
          ← Back to Home
        </Link>
      </div>

      {/* Main Form Container */}
      <div className="flex-1 flex items-center justify-center px-4 py-8 sm:px-6">
        <div className="w-full max-w-md">{children}</div>
      </div>

      {/* Auth Footer */}
      <div className="py-6 text-center text-xs text-muted-foreground">
        © 2026 Nex Network • Student Builder Platform
      </div>
    </div>
  );
}
