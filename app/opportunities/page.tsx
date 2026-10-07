"use client";

import * as React from "react";
import Link from "next/link";
import { AppShell } from "@/components/layout/app-shell";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { initialOpportunities } from "@/lib/mock-data";
import { Opportunity, OpportunityType, LocationType } from "@/lib/types";
import {
  Compass,
  Search,
  Bookmark,
  BookmarkCheck,
  ExternalLink,
  MapPin,
  Calendar,
  Award,
  Sparkles,
  Users,
  Filter,
  CheckCircle2,
  Clock,
} from "lucide-react";

const CATEGORIES: { label: string; value: OpportunityType | "ALL" }[] = [
  { label: "All Opportunities", value: "ALL" },
  { label: "Hackathons", value: "HACKATHON" },
  { label: "Grants & Funding", value: "GRANT" },
  { label: "Internships", value: "INTERNSHIP" },
  { label: "Fellowships", value: "FELLOWSHIP" },
  { label: "Competitions", value: "COMPETITION" },
];

export default function OpportunitiesPage() {
  const [opportunities] = React.useState<Opportunity[]>(initialOpportunities);
  const [selectedCategory, setSelectedCategory] = React.useState<OpportunityType | "ALL">("ALL");
  const [selectedLocation, setSelectedLocation] = React.useState<LocationType | "ALL">("ALL");
  const [searchQuery, setSearchQuery] = React.useState("");
  const [savedIds, setSavedIds] = React.useState<Set<string>>(new Set(["opp-1"]));
  const [showSavedOnly, setShowSavedOnly] = React.useState(false);

  // Toggle bookmark
  const toggleBookmark = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setSavedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  // Filter opportunities
  const filteredOpportunities = opportunities.filter((opp) => {
    const matchesCategory =
      selectedCategory === "ALL" || opp.type === selectedCategory;
    const matchesLocation =
      selectedLocation === "ALL" || opp.locationType === selectedLocation;
    const matchesSearch =
      opp.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      opp.organization.toLowerCase().includes(searchQuery.toLowerCase()) ||
      opp.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      opp.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesSaved = showSavedOnly ? savedIds.has(opp.id) : true;

    return matchesCategory && matchesLocation && matchesSearch && matchesSaved;
  });

  const getDaysRemaining = (deadline: string) => {
    const now = new Date("2026-10-02T10:00:00Z").getTime();
    const target = new Date(deadline).getTime();
    const diffDays = Math.ceil((target - now) / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getCategoryBadgeVariant = (type: OpportunityType) => {
    switch (type) {
      case "GRANT":
        return "success";
      case "HACKATHON":
        return "default";
      case "INTERNSHIP":
        return "secondary";
      case "FELLOWSHIP":
      case "COMPETITION":
        return "warning";
      default:
        return "outline";
    }
  };

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Header Title & Metrics */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground flex items-center gap-2">
              <Compass className="size-7 text-primary" />
              Opportunities & Student Grants
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Curated nationwide hackathons, DOST innovation grants, internships, and fellowships
            </p>
          </div>

          <div className="flex items-center gap-2 self-start md:self-auto">
            <Button
              variant={showSavedOnly ? "default" : "outline"}
              size="sm"
              onClick={() => setShowSavedOnly(!showSavedOnly)}
              className="gap-2 font-semibold text-xs"
            >
              {showSavedOnly ? (
                <BookmarkCheck className="size-3.5" />
              ) : (
                <Bookmark className="size-3.5" />
              )}
              Saved Programs ({savedIds.size})
            </Button>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <Card className="bg-card/70 border-border/80 p-4 space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input
                placeholder="Search by title, organization (e.g. DOST, NASA, GCash), or tech skill..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 bg-background/50 border-border/80 text-sm"
              />
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value as LocationType | "ALL")}
                className="h-9 px-3 rounded-lg border border-border/80 bg-background/50 text-xs font-medium text-foreground focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
              >
                <option value="ALL">All Formats</option>
                <option value="ONLINE">Virtual / Online</option>
                <option value="HYBRID">Hybrid</option>
                <option value="ONSITE">On-site</option>
              </select>
            </div>
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.value}
                onClick={() => setSelectedCategory(cat.value)}
                className={`px-3 py-1.5 rounded-full font-medium transition-all shrink-0 cursor-pointer ${
                  selectedCategory === cat.value
                    ? "bg-primary text-primary-foreground font-semibold shadow-sm"
                    : "bg-secondary/60 text-muted-foreground hover:text-foreground hover:bg-secondary"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </Card>

        {/* Opportunities List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-muted-foreground font-mono px-1">
            <span>
              Showing {filteredOpportunities.length} of {opportunities.length} programs
            </span>
            {showSavedOnly && (
              <span className="text-primary font-sans font-semibold">
                Viewing saved bookmarks only
              </span>
            )}
          </div>

          {filteredOpportunities.length === 0 ? (
            <Card className="bg-card/70 border-dashed border-border/80 p-12 text-center space-y-3">
              <Compass className="size-10 text-muted-foreground mx-auto opacity-50" />
              <h3 className="font-bold text-foreground text-base">No matching opportunities found</h3>
              <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                {showSavedOnly
                  ? "You have not bookmarked any programs yet. Bookmark items to review them later."
                  : "Try clearing search filters or selecting 'All Opportunities' to view all available grants."}
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("ALL");
                  setSelectedLocation("ALL");
                  setShowSavedOnly(false);
                }}
                className="mt-2 text-xs"
              >
                Reset All Filters
              </Button>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredOpportunities.map((opp) => {
                const daysLeft = getDaysRemaining(opp.deadline);
                const isSaved = savedIds.has(opp.id);

                return (
                  <Card
                    key={opp.id}
                    className="bg-card/70 border-border/80 hover:border-primary/40 transition-all flex flex-col justify-between group shadow-sm"
                  >
                    <CardContent className="p-5 space-y-4">
                      {/* Top Row: Org, Type, Bookmark */}
                      <div className="flex items-start justify-between gap-3">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <Badge
                              variant={getCategoryBadgeVariant(opp.type)}
                              className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5"
                            >
                              {opp.type}
                            </Badge>
                            {opp.featured && (
                              <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded-full border border-primary/20">
                                <Sparkles className="size-2.5" /> Featured
                              </span>
                            )}
                          </div>
                          <p className="text-xs font-medium text-muted-foreground">
                            {opp.organization}
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={(e) => toggleBookmark(opp.id, e)}
                          className={`p-2 rounded-lg transition-colors cursor-pointer border ${
                            isSaved
                              ? "bg-primary/10 text-primary border-primary/30"
                              : "text-muted-foreground hover:text-foreground border-border/60 hover:bg-secondary/60"
                          }`}
                          title={isSaved ? "Remove from bookmarks" : "Save opportunity"}
                          aria-label="Bookmark opportunity"
                        >
                          {isSaved ? (
                            <BookmarkCheck className="size-4 text-primary fill-primary/20" />
                          ) : (
                            <Bookmark className="size-4" />
                          )}
                        </button>
                      </div>

                      {/* Title & Reward */}
                      <div className="space-y-1.5">
                        <a
                          href={opp.applicationUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-bold text-base text-foreground group-hover:text-primary transition-colors block leading-snug"
                        >
                          {opp.title}
                        </a>
                        <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary bg-primary/10 px-2.5 py-1 rounded-md border border-primary/20">
                          <Award className="size-3.5 shrink-0" />
                          <span>{opp.reward}</span>
                        </div>
                      </div>

                      {/* Description */}
                      <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                        {opp.description}
                      </p>

                      {/* Location & Eligibility Pills */}
                      <div className="flex flex-wrap items-center gap-2 text-[11px] text-muted-foreground pt-1 border-t border-border/40">
                        <span className="flex items-center gap-1 font-mono">
                          <MapPin className="size-3 text-primary" />
                          {opp.location}
                        </span>
                        <span className="text-border/80">•</span>
                        <span className="flex items-center gap-1">
                          <Users className="size-3 text-muted-foreground" />
                          {opp.eligibility}
                        </span>
                      </div>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-1.5">
                        {opp.tags.map((tag) => (
                          <span
                            key={tag}
                            className="text-[10px] font-mono bg-secondary/80 text-secondary-foreground px-2 py-0.5 rounded"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>

                      {/* Footer: Deadline & Apply Button */}
                      <div className="flex items-center justify-between pt-3 border-t border-border/50">
                        <div className="flex items-center gap-1.5 text-xs font-mono">
                          <Clock className="size-3.5 text-muted-foreground" />
                          {daysLeft > 0 ? (
                            <span
                              className={
                                daysLeft <= 7
                                  ? "text-amber-400 font-bold"
                                  : "text-muted-foreground"
                              }
                            >
                              {daysLeft <= 7 ? `Urgent: ${daysLeft}d left` : `${daysLeft} days left`}
                            </span>
                          ) : (
                            <span className="text-destructive font-bold">Closed</span>
                          )}
                        </div>

                        <a
                          href={opp.applicationUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                        >
                          Apply Now
                          <ExternalLink className="size-3.5" />
                        </a>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}
