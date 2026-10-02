"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NexLogo } from "@/components/ui/nex-logo";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { currentUserProfile } from "@/lib/mock-data";
import { NotificationPopover } from "./notification-popover";
import {
  Search,
  Plus,
  MessageSquare,
  LayoutDashboard,
  FolderGit2,
  Compass,
  Calendar,
} from "lucide-react";

export function AppHeader() {
  const pathname = usePathname();

  const navLinks = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/community", label: "Community", icon: MessageSquare },
    { href: "/projects", label: "Projects", icon: FolderGit2 },
    { href: "/opportunities", label: "Opportunities", icon: Compass },
    { href: "/events", label: "Events", icon: Calendar },
  ];

  return (
    <header className="border-b border-border/80 sticky top-0 z-50 bg-background/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Logo & Navigation */}
        <div className="flex items-center gap-8">
          <Link href="/dashboard" className="shrink-0">
            <NexLogo size={26} />
          </Link>

          <nav className="hidden md:flex items-center gap-1 text-sm font-medium">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors ${
                    isActive
                      ? "text-primary font-semibold bg-primary/10"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
                  }`}
                >
                  <Icon className="size-4" />
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          {/* Quick Search Bar */}
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border bg-card/60 text-xs text-muted-foreground">
            <Search className="size-3.5" />
            <span>Search discussions, projects...</span>
            <kbd className="px-1.5 py-0.5 rounded bg-muted text-[10px] font-mono border border-border">
              Ctrl+K
            </kbd>
          </div>

          {/* Quick Create Post */}
          <Link href="/community">
            <Button size="sm" className="hidden sm:inline-flex gap-1.5 font-semibold">
              <Plus className="size-4" />
              New Post
            </Button>
          </Link>

          {/* Interactive Notifications System */}
          <NotificationPopover />

          {/* User Profile Avatar */}
          <Link
            href={`/profile/${currentUserProfile.username}`}
            className="flex items-center gap-2 p-1 rounded-full hover:ring-2 hover:ring-primary/40 transition-all"
            title={`${currentUserProfile.firstName} ${currentUserProfile.lastName}`}
          >
            <Avatar fallback="GV" className="size-8 text-xs border-primary/40" />
          </Link>
        </div>
      </div>
    </header>
  );
}
