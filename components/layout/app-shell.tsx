import React from "react";
import { AppHeader } from "./app-header";

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col selection:bg-primary/20 selection:text-primary">
      <AppHeader />
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {children}
      </main>
      <footer className="border-t border-border/80 py-6 bg-card/30 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <span>© 2026 Nex Network • Built for Student Tech Builders</span>
          <div className="flex items-center gap-4">
            <span className="text-primary font-medium">Learn. Build. Collaborate. Compete. Connect.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
