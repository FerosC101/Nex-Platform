"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { initialPosts, initialProjects, initialOpportunities, currentUserProfile } from "@/lib/mock-data";
import {
  Search,
  MessageSquare,
  FolderGit2,
  Compass,
  User,
  X,
  ArrowRight,
  Sparkles,
} from "lucide-react";

interface SearchResult {
  id: string;
  type: "DISCUSSION" | "PROJECT" | "OPPORTUNITY" | "PERSON";
  title: string;
  subtitle: string;
  link: string;
  badge: string;
}

export function GlobalSearchDialog() {
  const router = useRouter();
  const [isOpen, setIsOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const [filterType, setFilterType] = React.useState<"ALL" | "DISCUSSION" | "PROJECT" | "OPPORTUNITY" | "PERSON">("ALL");
  const inputRef = React.useRef<HTMLInputElement>(null);

  // Listen for Ctrl+F or Cmd+F globally
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "f") {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      } else if (e.key === "Escape") {
        setIsOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Auto focus input when opened
  React.useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery("");
    }
  }, [isOpen]);

  // Aggregate searchable items
  const allResults: SearchResult[] = React.useMemo(() => {
    const list: SearchResult[] = [];

    // Posts / Discussions
    initialPosts.forEach((post) => {
      list.push({
        id: `post-${post.id}`,
        type: "DISCUSSION",
        title: post.title,
        subtitle: post.content.slice(0, 90) + "...",
        link: `/community/${post.id}`,
        badge: post.postType,
      });
    });

    // Projects
    initialProjects.forEach((proj) => {
      list.push({
        id: `proj-${proj.id}`,
        type: "PROJECT",
        title: proj.name,
        subtitle: proj.description.slice(0, 90) + "...",
        link: `/projects/${proj.id}`,
        badge: proj.status,
      });
    });

    // Opportunities
    initialOpportunities.forEach((opp) => {
      list.push({
        id: `opp-${opp.id}`,
        type: "OPPORTUNITY",
        title: opp.title,
        subtitle: `${opp.organization} • ${opp.reward}`,
        link: "/opportunities",
        badge: opp.type,
      });
    });

    // People
    const people = [
      {
        name: `${currentUserProfile.firstName} ${currentUserProfile.lastName}`,
        username: currentUserProfile.username,
        school: currentUserProfile.schoolName,
      },
      { name: "David Christian Reyes", username: "dreyes", school: "PUP Manila" },
      { name: "Marcus Aurelius Tan", username: "marcustan", school: "BatStateU" },
      { name: "Bea Patricia Cruz", username: "beacruz", school: "Mapua University" },
    ];

    people.forEach((p) => {
      list.push({
        id: `person-${p.username}`,
        type: "PERSON",
        title: p.name,
        subtitle: `@${p.username} • ${p.school}`,
        link: `/profile/${p.username}`,
        badge: "Student Builder",
      });
    });

    return list;
  }, []);

  const filteredResults = React.useMemo(() => {
    if (!query.trim()) return [];

    const q = query.toLowerCase();
    return allResults.filter((item) => {
      const matchesType = filterType === "ALL" || item.type === filterType;
      const matchesText =
        item.title.toLowerCase().includes(q) ||
        item.subtitle.toLowerCase().includes(q) ||
        item.badge.toLowerCase().includes(q);
      return matchesType && matchesText;
    });
  }, [query, filterType, allResults]);

  const handleSelect = (link: string) => {
    setIsOpen(false);
    router.push(link);
  };

  const getResultIcon = (type: SearchResult["type"]) => {
    switch (type) {
      case "DISCUSSION":
        return <MessageSquare className="size-4 text-cyan-400" />;
      case "PROJECT":
        return <FolderGit2 className="size-4 text-primary" />;
      case "OPPORTUNITY":
        return <Compass className="size-4 text-amber-400" />;
      case "PERSON":
        return <User className="size-4 text-emerald-400" />;
    }
  };

  return (
    <>
      {/* Search Trigger Button for Header */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border/80 bg-card/60 text-xs text-muted-foreground hover:text-foreground hover:border-primary/40 transition-colors cursor-pointer"
        aria-label="Open global search (Ctrl+F)"
      >
        <Search className="size-3.5" />
        <span>Search discussions, projects, grants...</span>
        <kbd className="px-1.5 py-0.5 rounded bg-muted text-[10px] font-mono border border-border text-foreground font-semibold">
          Ctrl+F
        </kbd>
      </button>

      {/* Modal Dialog */}
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-start justify-center pt-20 p-4">
          <div className="w-full max-w-2xl bg-card border border-border/80 rounded-xl shadow-2xl overflow-hidden animate-in fade-in-0 zoom-in-95 duration-100">
            {/* Input Header */}
            <div className="p-3.5 px-4 border-b border-border/80 flex items-center gap-3 bg-background/50">
              <Search className="size-5 text-primary shrink-0" />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search across discussions, projects, opportunities, and students..."
                className="w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  className="p-1 rounded text-muted-foreground hover:text-foreground"
                >
                  <X className="size-4" />
                </button>
              )}
              <kbd className="hidden sm:inline-block px-1.5 py-0.5 rounded bg-muted text-[10px] font-mono border border-border text-muted-foreground">
                ESC
              </kbd>
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-1.5 px-4 py-2 bg-card/70 border-b border-border/60 text-xs overflow-x-auto">
              {[
                { label: "All", value: "ALL" },
                { label: "Discussions", value: "DISCUSSION" },
                { label: "Projects", value: "PROJECT" },
                { label: "Opportunities", value: "OPPORTUNITY" },
                { label: "People", value: "PERSON" },
              ].map((tab) => (
                <button
                  key={tab.value}
                  type="button"
                  onClick={() => setFilterType(tab.value as any)}
                  className={`px-2.5 py-1 rounded-full text-[11px] font-medium transition-colors cursor-pointer ${
                    filterType === tab.value
                      ? "bg-primary text-primary-foreground font-semibold"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary/60"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Search Results List */}
            <div className="max-h-96 overflow-y-auto divide-y divide-border/40 p-1">
              {!query.trim() ? (
                <div className="p-8 text-center space-y-2">
                  <Sparkles className="size-6 text-primary mx-auto opacity-70" />
                  <p className="text-xs text-foreground font-semibold">
                    Global Section 17 Search
                  </p>
                  <p className="text-[11px] text-muted-foreground max-w-sm mx-auto">
                    Try searching for "Next.js", "DOST", "Python", "AgriSense", or a student name.
                  </p>
                </div>
              ) : filteredResults.length === 0 ? (
                <div className="p-8 text-center text-xs text-muted-foreground">
                  No matches found for "{query}". Try a different keyword.
                </div>
              ) : (
                filteredResults.map((result) => (
                  <div
                    key={result.id}
                    onClick={() => handleSelect(result.link)}
                    className="p-3 px-4 flex items-center justify-between gap-3 hover:bg-muted/40 cursor-pointer rounded-lg transition-colors group"
                  >
                    <div className="flex items-start gap-3 min-w-0">
                      <div className="size-8 rounded-lg bg-background/80 border border-border/60 flex items-center justify-center shrink-0 mt-0.5">
                        {getResultIcon(result.type)}
                      </div>
                      <div className="min-w-0 space-y-0.5">
                        <div className="flex items-center gap-2">
                          <p className="font-semibold text-xs text-foreground group-hover:text-primary transition-colors truncate">
                            {result.title}
                          </p>
                          <span className="text-[9px] font-mono uppercase px-1.5 py-0.2 rounded bg-secondary text-secondary-foreground border border-border/60 shrink-0">
                            {result.badge}
                          </span>
                        </div>
                        <p className="text-[11px] text-muted-foreground truncate">
                          {result.subtitle}
                        </p>
                      </div>
                    </div>

                    <ArrowRight className="size-3.5 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            <div className="p-2.5 px-4 bg-muted/20 border-t border-border/60 flex items-center justify-between text-[11px] text-muted-foreground font-mono">
              <span>Press Ctrl+F anytime to search</span>
              <span>{filteredResults.length} results</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
