"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { initialNotifications } from "@/lib/mock-data";
import { AppNotification, NotificationType } from "@/lib/types";
import {
  Bell,
  Users,
  MessageSquare,
  Compass,
  Calendar,
  Sparkles,
  CheckCheck,
  ExternalLink,
} from "lucide-react";

export function NotificationPopover() {
  const router = useRouter();
  const [isOpen, setIsOpen] = React.useState(false);
  const [notifications, setNotifications] = React.useState<AppNotification[]>(
    initialNotifications
  );
  const popoverRef = React.useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  // Handle outside click
  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const markAllAsRead = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const markAsReadAndNavigate = (notification: AppNotification) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === notification.id ? { ...n, isRead: true } : n))
    );
    setIsOpen(false);
    router.push(notification.link);
  };

  const getNotificationIcon = (type: NotificationType) => {
    switch (type) {
      case "COLLABORATION_REQUEST":
        return <Users className="size-4 text-primary" />;
      case "COMMENT_REPLY":
        return <MessageSquare className="size-4 text-cyan-400" />;
      case "OPPORTUNITY_DEADLINE":
        return <Compass className="size-4 text-amber-400" />;
      case "EVENT_REMINDER":
        return <Calendar className="size-4 text-emerald-400" />;
      case "UPVOTE_MILESTONE":
        return <Sparkles className="size-4 text-purple-400" />;
      default:
        return <Bell className="size-4 text-muted-foreground" />;
    }
  };

  const formatRelativeTime = (dateStr: string) => {
    const diffMs = new Date("2026-10-02T10:00:00Z").getTime() - new Date(dateStr).getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 60) return `${Math.max(1, diffMins)}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  return (
    <div className="relative" ref={popoverRef}>
      {/* Bell Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-lg border border-border bg-card/40 text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-colors cursor-pointer"
        aria-label="Notifications"
        aria-expanded={isOpen}
      >
        <Bell className="size-4" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground font-mono ring-2 ring-background">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Popover */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-xl border border-border/80 bg-card shadow-2xl z-50 overflow-hidden animate-in fade-in-0 zoom-in-95 duration-100">
          {/* Popover Header */}
          <div className="p-3.5 px-4 border-b border-border/80 flex items-center justify-between bg-card/90">
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm text-foreground">Notifications</span>
              {unreadCount > 0 && (
                <span className="px-1.5 py-0.2 rounded-full text-[10px] font-mono bg-primary/20 text-primary font-bold">
                  {unreadCount} new
                </span>
              )}
            </div>

            {unreadCount > 0 && (
              <button
                type="button"
                onClick={markAllAsRead}
                className="text-xs text-primary hover:underline font-medium inline-flex items-center gap-1 cursor-pointer"
              >
                <CheckCheck className="size-3.5" />
                Mark all read
              </button>
            )}
          </div>

          {/* Notifications List */}
          <div className="max-h-96 overflow-y-auto divide-y divide-border/40">
            {notifications.length === 0 ? (
              <div className="p-8 text-center text-xs text-muted-foreground">
                No notifications right now.
              </div>
            ) : (
              notifications.map((notif) => (
                <div
                  key={notif.id}
                  onClick={() => markAsReadAndNavigate(notif)}
                  className={`p-3.5 px-4 flex items-start gap-3 hover:bg-muted/30 cursor-pointer transition-colors ${
                    !notif.isRead ? "bg-primary/5" : ""
                  }`}
                >
                  <div className="size-8 rounded-lg bg-background/80 border border-border/60 flex items-center justify-center shrink-0 mt-0.5">
                    {getNotificationIcon(notif.type)}
                  </div>

                  <div className="flex-1 space-y-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className="font-semibold text-xs text-foreground truncate">
                        {notif.title}
                      </p>
                      <span className="text-[10px] font-mono text-muted-foreground shrink-0">
                        {formatRelativeTime(notif.createdAt)}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                      {notif.message}
                    </p>
                  </div>

                  {!notif.isRead && (
                    <span className="size-2 rounded-full bg-primary shrink-0 mt-1.5" />
                  )}
                </div>
              ))
            )}
          </div>

          {/* Popover Footer */}
          <div className="p-2.5 px-4 bg-muted/20 border-t border-border/60 text-center">
            <span className="text-[11px] text-muted-foreground font-mono">
              Notifications automatically sync across your device
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
