"use client";

import * as React from "react";
import Link from "next/link";
import { AppShell } from "@/components/layout/app-shell";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { initialTesterRequests, initialProjects, currentUserProfile } from "@/lib/mock-data";
import { TesterRequest } from "@/lib/types";
import {
  FlaskConical,
  Search,
  Plus,
  Clock,
  Users,
  ExternalLink,
  CheckCircle2,
  Sparkles,
  Calendar,
  Send,
  X,
} from "lucide-react";

export default function TestersPage() {
  const [requests, setRequests] = React.useState<TesterRequest[]>(initialTesterRequests);
  const [signedUpIds, setSignedUpIds] = React.useState<Set<string>>(new Set(["test-req-1"]));
  const [searchQuery, setSearchQuery] = React.useState("");
  const [filterView, setFilterView] = React.useState<"ALL" | "MY_SIGNUPS">("ALL");

  // Create Modal State
  const [isCreateOpen, setIsCreateOpen] = React.useState(false);
  const [newTitle, setNewTitle] = React.useState("");
  const [newProject, setNewProject] = React.useState("Nex Community Platform");
  const [newDescription, setNewDescription] = React.useState("");
  const [newCount, setNewCount] = React.useState(5);
  const [newTime, setNewTime] = React.useState("15 mins");
  const [newUrl, setNewUrl] = React.useState("");

  const handleSignUp = (requestId: string) => {
    setSignedUpIds((prev) => {
      const next = new Set(prev);
      if (next.has(requestId)) {
        next.delete(requestId);
        setRequests((reqs) =>
          reqs.map((r) =>
            r.id === requestId ? { ...r, signupsCount: Math.max(0, r.signupsCount - 1) } : r
          )
        );
      } else {
        next.add(requestId);
        setRequests((reqs) =>
          reqs.map((r) =>
            r.id === requestId ? { ...r, signupsCount: Math.min(r.numberNeeded, r.signupsCount + 1) } : r
          )
        );
      }
      return next;
    });
  };

  const handleCreateRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newDescription.trim()) return;

    const newReq: TesterRequest = {
      id: `test-req-${Date.now()}`,
      projectId: "proj-1",
      projectName: newProject,
      creatorId: currentUserProfile.userId,
      creator: {
        id: currentUserProfile.userId,
        name: `${currentUserProfile.firstName} ${currentUserProfile.lastName}`,
        username: currentUserProfile.username,
        school: currentUserProfile.schoolName,
        course: currentUserProfile.course,
      },
      title: newTitle.trim(),
      description: newDescription.trim(),
      numberNeeded: Number(newCount) || 5,
      estimatedTime: newTime.trim() || "15 mins",
      deadline: "2026-10-31T23:59:59Z",
      status: "OPEN",
      signupsCount: 0,
      testUrl: newUrl.trim() || undefined,
      createdAt: new Date().toISOString(),
    };

    setRequests([newReq, ...requests]);
    setIsCreateOpen(false);
    setNewTitle("");
    setNewDescription("");
    setNewUrl("");
  };

  const filteredRequests = requests.filter((req) => {
    const matchesSearch =
      req.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.projectName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.creator.name.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesView = filterView === "MY_SIGNUPS" ? signedUpIds.has(req.id) : true;
    return matchesSearch && matchesView;
  });

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Header Title & Create Action */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground flex items-center gap-2">
              <FlaskConical className="size-7 text-primary" />
              Beta Tester Exchange Board
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Recruit student peers to test your prototype or help fellow university builders test theirs
            </p>
          </div>

          <Button
            size="sm"
            onClick={() => setIsCreateOpen(true)}
            className="font-semibold gap-1.5 self-start sm:self-auto text-xs"
          >
            <Plus className="size-4" />
            Request Testers
          </Button>
        </div>

        {/* Filter & Search Bar */}
        <Card className="bg-card/70 border-border/80 p-4 space-y-3">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input
                placeholder="Search tester requests by prototype name, keywords, or builder..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 bg-background/50 border-border/80 text-sm"
              />
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              <button
                type="button"
                onClick={() => setFilterView("ALL")}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                  filterView === "ALL"
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary/60 text-muted-foreground hover:text-foreground hover:bg-secondary"
                }`}
              >
                All Requests ({requests.length})
              </button>
              <button
                type="button"
                onClick={() => setFilterView("MY_SIGNUPS")}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                  filterView === "MY_SIGNUPS"
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary/60 text-muted-foreground hover:text-foreground hover:bg-secondary"
                }`}
              >
                My Testing ({signedUpIds.size})
              </button>
            </div>
          </div>
        </Card>

        {/* Tester Requests List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-muted-foreground font-mono px-1">
            <span>Showing {filteredRequests.length} active testing requests</span>
          </div>

          {filteredRequests.length === 0 ? (
            <Card className="bg-card/70 border-dashed border-border/80 p-12 text-center space-y-3">
              <FlaskConical className="size-10 text-muted-foreground mx-auto opacity-50" />
              <h3 className="font-bold text-foreground text-base">No tester requests found</h3>
              <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                {filterView === "MY_SIGNUPS"
                  ? "You have not signed up to test any prototypes yet."
                  : "No testing requests match your current search."}
              </p>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredRequests.map((req) => {
                const isSignedUp = signedUpIds.has(req.id);
                const spotsLeft = req.numberNeeded - req.signupsCount;

                return (
                  <Card
                    key={req.id}
                    className="bg-card/70 border-border/80 hover:border-primary/40 transition-all flex flex-col justify-between shadow-sm"
                  >
                    <CardContent className="p-5 space-y-3.5">
                      {/* Top Row: Project Name & Time Required */}
                      <div className="flex items-start justify-between gap-3">
                        <div className="space-y-0.5">
                          <span className="text-[11px] font-mono text-primary font-semibold">
                            {req.projectName}
                          </span>
                          <h3 className="font-bold text-foreground text-base leading-snug">
                            {req.title}
                          </h3>
                        </div>

                        <Badge variant="secondary" className="text-[10px] font-mono shrink-0">
                          <Clock className="size-3 mr-1" />
                          {req.estimatedTime}
                        </Badge>
                      </div>

                      {/* Instructions */}
                      <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                        {req.description}
                      </p>

                      {/* Creator attribution */}
                      <div className="flex items-center justify-between text-[11px] text-muted-foreground pt-1 border-t border-border/40 font-mono">
                        <span>Requested by @{req.creator.username}</span>
                        <span>{req.creator.school}</span>
                      </div>

                      {/* Capacity progress */}
                      <div className="space-y-1.5 pt-1">
                        <div className="flex items-center justify-between text-[11px] font-mono">
                          <span className="flex items-center gap-1 text-muted-foreground">
                            <Users className="size-3 text-primary" />
                            {req.signupsCount} / {req.numberNeeded} Testers
                          </span>
                          <span
                            className={
                              spotsLeft <= 2 ? "text-amber-400 font-bold" : "text-muted-foreground"
                            }
                          >
                            {spotsLeft > 0 ? `${spotsLeft} slots left` : "Quota Filled"}
                          </span>
                        </div>
                        <div className="h-1.5 w-full bg-secondary/80 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-primary rounded-full transition-all"
                            style={{
                              width: `${Math.min(100, (req.signupsCount / req.numberNeeded) * 100)}%`,
                            }}
                          />
                        </div>
                      </div>

                      {/* Footer Actions */}
                      <div className="flex items-center justify-between pt-2 border-t border-border/60">
                        {req.testUrl ? (
                          <a
                            href={req.testUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-xs text-primary hover:underline font-medium"
                          >
                            Open Prototype <ExternalLink className="size-3" />
                          </a>
                        ) : (
                          <span className="text-[11px] text-muted-foreground font-mono">
                            URL shared upon sign-up
                          </span>
                        )}

                        <Button
                          size="sm"
                          variant={isSignedUp ? "secondary" : "default"}
                          onClick={() => handleSignUp(req.id)}
                          className="font-semibold text-xs h-8 gap-1.5"
                        >
                          {isSignedUp ? (
                            <>
                              <CheckCircle2 className="size-3.5 text-primary" />
                              Testing (Cancel)
                            </>
                          ) : (
                            "Sign Up to Test"
                          )}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>

        {/* Modal: Create Tester Request */}
        {isCreateOpen && (
          <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4">
            <Card className="w-full max-w-lg bg-card border-border/80 shadow-2xl p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                  <FlaskConical className="size-5 text-primary" />
                  Request Peer Beta Testers
                </h3>
                <button
                  type="button"
                  onClick={() => setIsCreateOpen(false)}
                  className="p-1 rounded-md text-muted-foreground hover:text-foreground"
                >
                  <X className="size-4" />
                </button>
              </div>

              <form onSubmit={handleCreateRequest} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Project Prototype</label>
                  <Input
                    value={newProject}
                    onChange={(e) => setNewProject(e.target.value)}
                    placeholder="e.g. AgriSense IoT, Nex Platform..."
                    required
                    className="text-xs"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Testing Request Title</label>
                  <Input
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="e.g. Need 5 students to test checkout and payment webhooks"
                    required
                    className="text-xs"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">
                    Instructions & Specific Things to Test
                  </label>
                  <textarea
                    value={newDescription}
                    onChange={(e) => setNewDescription(e.target.value)}
                    placeholder="Specify the testing steps, device requirements (e.g. mobile vs desktop), and feedback questions..."
                    rows={3}
                    required
                    className="w-full rounded-md border border-border/80 bg-background/50 p-2.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-foreground">Testers Needed</label>
                    <Input
                      type="number"
                      min={1}
                      max={50}
                      value={newCount}
                      onChange={(e) => setNewCount(Number(e.target.value))}
                      className="text-xs"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-foreground">Estimated Time</label>
                    <Input
                      value={newTime}
                      onChange={(e) => setNewTime(e.target.value)}
                      placeholder="e.g. 15 mins"
                      className="text-xs"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">
                    Prototype URL (Optional)
                  </label>
                  <Input
                    value={newUrl}
                    onChange={(e) => setNewUrl(e.target.value)}
                    placeholder="https://your-demo-url.vercel.app"
                    className="text-xs font-mono"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-border/60">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setIsCreateOpen(false)}
                    className="text-xs"
                  >
                    Cancel
                  </Button>
                  <Button type="submit" size="sm" className="text-xs font-semibold gap-1.5">
                    <Send className="size-3.5" />
                    Publish Request
                  </Button>
                </div>
              </form>
            </Card>
          </div>
        )}
      </div>
    </AppShell>
  );
}
