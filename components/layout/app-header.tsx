"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NexLogo } from "@/components/ui/nex-logo";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { currentUserProfile } from "@/lib/mock-data";
import { NotificationPopover } from "./notification-popover";
import { GlobalSearchDialog } from "./global-search-dialog";
import {
  Search,
  Plus,
  MessageSquare,
  LayoutDashboard,
  FolderGit2,
  Compass,
  Calendar,
  FlaskConical,
} from "lucide-react";

export function AppHeader() {
  const pathname = usePathname();

  const navLinks = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/community", label: "Community", icon: MessageSquare },
    { href: "/projects", label: "Projects", icon: FolderGit2 },
    { href: "/opportunities", label: "Opportunities", icon: Compass },
    { href: "/events", label: "Events", icon: Calendar },
    { href: "/testers", label: "Testers", icon: FlaskConical },
  ];

  return (
    <header className="border-b border-border/80 sticky top-0 z-50 bg-background/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3">
        {/* Logo & Navigation */}
        <div className="flex items-center gap-4 lg:gap-6 min-w-0">
          <Link href="/dashboard" className="shrink-0">
            <NexLogo size={24} />
          </Link>

          <nav className="hidden md:flex items-center gap-0.5 lg:gap-1 text-xs lg:text-sm font-medium">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg transition-colors whitespace-nowrap ${
                    isActive
                      ? "text-primary font-semibold bg-primary/10"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
                  }`}
                >
                  <Icon className="size-3.5 lg:size-4" />
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
          {/* Global In-App Search (Ctrl+F) */}
          <GlobalSearchDialog />

          {/* Quick Create Post */}
          <Link href="/community" className="hidden xl:inline-flex">
            <Button size="sm" className="h-8 px-2.5 text-xs font-semibold gap-1">
              <Plus className="size-3.5" />
              New Post
            </Button>
          </Link>

          {/* Interactive Notifications System */}
          <NotificationPopover />

          {/* User Profile Avatar */}
          <Link
            href={`/profile/${currentUserProfile.username}`}
            className="flex items-center gap-2 p-0.5 rounded-full hover:ring-2 hover:ring-primary/40 transition-all shrink-0"
            title={`${currentUserProfile.firstName} ${currentUserProfile.lastName}`}
          >
            <Avatar fallback="GV" className="size-8 text-xs border-primary/40" />
          </Link>
        </div>
      </div>
    </header>
  );
}
