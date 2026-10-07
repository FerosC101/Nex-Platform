"use client";

import * as React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { AppShell } from "@/components/layout/app-shell";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Avatar } from "@/components/ui/avatar";
import { initialProjects, currentUserProfile } from "@/lib/mock-data";
import { Project, CollaborationApplication } from "@/lib/types";
import {
  FolderGit2,
  ArrowLeft,
  GitBranch,
  Globe,
  Users,
  CheckCircle2,
  Calendar,
  Send,
  Sparkles,
  School,
  ExternalLink,
} from "lucide-react";

export default function ProjectDetailPage() {
  const params = useParams();
  const projectId = params.id as string;

  const foundProject =
    initialProjects.find((p) => p.id === projectId) || initialProjects[0];
  const [project] = React.useState<Project>(foundProject);

  // Collaboration Application State
  const [activeApplyingRequestId, setActiveApplyingRequestId] = React.useState<string | null>(null);
  const [applicationMessage, setApplicationMessage] = React.useState("");
  const [isSubmittingApp, setIsSubmittingApp] = React.useState(false);
  const [submittedRequests, setSubmittedRequests] = React.useState<string[]>([]);

  const handleApply = (requestId: string, e: React.FormEvent) => {
    e.preventDefault();
    if (!applicationMessage.trim()) return;

    setIsSubmittingApp(true);
    setTimeout(() => {
      setSubmittedRequests((prev) => [...prev, requestId]);
      setIsSubmittingApp(false);
      setActiveApplyingRequestId(null);
      setApplicationMessage("");
    }, 500);
  };

  return (
    <AppShell>
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Back Link */}
        <Link
          href="/projects"
          className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors font-medium"
        >
          <ArrowLeft className="size-3.5" />
          Back to Projects Directory
        </Link>

        {/* Project Header Banner Card */}
        <Card className="border-border/80 bg-card overflow-hidden shadow-lg">
          <div className="h-28 sm:h-36 bg-gradient-to-r from-secondary via-card to-primary/20 p-6 flex flex-col justify-end relative">
            <div className="flex items-center justify-between gap-2 z-10">
              <span className="text-[11px] font-mono uppercase tracking-widest text-primary font-bold">
                {project.category}
              </span>
              <Badge variant="default" className="text-xs uppercase font-mono tracking-wider">
                {project.status}
              </Badge>
            </div>
          </div>

          <CardContent className="p-6 sm:p-8 space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/60 pb-6">
              <div className="space-y-1">
                <h1 className="text-2xl sm:text-4xl font-extrabold text-foreground">
                  {project.name}
                </h1>
                <p className="text-xs text-muted-foreground flex items-center gap-1.5 pt-0.5">
                  <School className="size-3.5 text-primary" />
                  Initiated by {project.owner.name} ({project.owner.school})
                </p>
              </div>

              {/* Action Buttons: Repo & Demo */}
              <div className="flex flex-wrap items-center gap-3">
                {project.repositoryUrl && (
                  <a
                    href={project.repositoryUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-border bg-secondary text-xs font-semibold text-foreground hover:bg-muted/60 transition-colors"
                  >
                    <GitBranch className="size-4" />
                    Repository
                  </a>
                )}
                {project.demoUrl && (
                  <a
                    href={project.demoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 transition-colors shadow-sm"
                  >
                    <Globe className="size-4" />
                    Live Demo
                    <ExternalLink className="size-3 ml-0.5" />
                  </a>
                )}
              </div>
            </div>

            {/* Description & Overview */}
            <div className="space-y-3">
              <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
                About the Project
              </h3>
              <p className="text-sm sm:text-base text-foreground/90 leading-relaxed whitespace-pre-line">
                {project.description}
              </p>
            </div>

            {/* Tech Stack Chips */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Technologies & Architecture
              </h3>
              <div className="flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="font-mono text-xs py-1 px-3">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 2-Column Section: Team Members (left) & Open Collaboration Requests (right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Team Members List (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <Card className="border-border/80 bg-card">
              <CardHeader className="p-5 pb-3 border-b border-border/60">
                <CardTitle className="text-sm font-bold uppercase tracking-wider text-foreground flex items-center gap-2">
                  <Users className="size-4 text-primary" />
                  Project Team ({project.members.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="p-5 space-y-3">
                {project.members.map((member) => (
                  <div
                    key={member.id}
                    className="p-3 rounded-lg bg-secondary/40 border border-border/60 flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-2.5">
                      <Avatar
                        fallback={member.user.name.slice(0, 2)}
                        className="size-8 text-xs border-primary/30"
                      />
                      <div>
                        <p className="text-xs font-bold text-foreground">
                          {member.user.name}
                        </p>
                        <p className="text-[10px] text-muted-foreground">
                          {member.user.school}
                        </p>
                      </div>
                    </div>

                    <Badge variant="outline" className="text-[10px] font-medium text-primary border-primary/30">
                      {member.role}
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Open Collaboration Requests (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            <Card className="border-border/80 bg-card">
              <CardHeader className="p-5 pb-3 border-b border-border/60">
                <CardTitle className="text-sm font-bold uppercase tracking-wider text-foreground flex items-center gap-2">
                  <Sparkles className="size-4 text-primary" />
                  Open Teammate Collaboration Requests
                </CardTitle>
              </CardHeader>
              <CardContent className="p-5 space-y-4">
                {!project.collaborationRequests || project.collaborationRequests.length === 0 ? (
                  <div className="p-8 text-center text-xs text-muted-foreground border border-dashed border-border/80 rounded-xl">
                    This project is not actively recruiting new teammates at the moment.
                  </div>
                ) : (
                  project.collaborationRequests.map((request) => {
                    const hasApplied = submittedRequests.includes(request.id);
                    const isApplying = activeApplyingRequestId === request.id;

                    return (
                      <div
                        key={request.id}
                        className="p-4 sm:p-5 rounded-xl border border-primary/20 bg-secondary/30 space-y-3"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="text-sm sm:text-base font-bold text-foreground">
                            {request.title}
                          </h4>
                          <Badge variant="default" className="text-[10px] py-0 px-2 uppercase shrink-0">
                            {request.status}
                          </Badge>
                        </div>

                        <p className="text-xs text-muted-foreground leading-relaxed">
                          {request.description}
                        </p>

                        {/* Skills Required */}
                        <div className="space-y-1">
                          <span className="text-[10px] font-semibold text-muted-foreground uppercase">
                            Skills Preferred:
                          </span>
                          <div className="flex flex-wrap gap-1.5 pt-0.5">
                            {request.skillsRequired.map((skill) => (
                              <Badge key={skill} variant="secondary" className="text-[10px] py-0 px-2 font-mono">
                                {skill}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        {/* Action: Apply for Collaboration */}
                        <div className="pt-2 border-t border-border/50 flex items-center justify-between">
                          <span className="text-[11px] text-muted-foreground">
                            {request.applicationsCount + (hasApplied ? 1 : 0)} student applicants
                          </span>

                          {hasApplied ? (
                            <span className="inline-flex items-center gap-1.5 text-xs text-emerald-400 font-semibold">
                              <CheckCircle2 className="size-4" />
                              Application Submitted
                            </span>
                          ) : (
                            <Button
                              size="sm"
                              onClick={() => setActiveApplyingRequestId(isApplying ? null : request.id)}
                              className="font-semibold text-xs gap-1.5"
                            >
                              <Users className="size-3.5" />
                              {isApplying ? "Cancel" : "Apply to Join"}
                            </Button>
                          )}
                        </div>

                        {/* Interactive Application Drawer */}
                        {isApplying && (
                          <form
                            onSubmit={(e) => handleApply(request.id, e)}
                            className="pt-3 border-t border-primary/20 space-y-3 animate-in fade-in"
                          >
                            <label className="text-xs font-semibold text-foreground">
                              Why would you like to join this project?
                            </label>
                            <Textarea
                              rows={3}
                              placeholder="Describe your background, what you can contribute, and your weekly availability..."
                              value={applicationMessage}
                              onChange={(e) => setApplicationMessage(e.target.value)}
                              required
                            />
                            <div className="flex justify-end gap-2">
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => setActiveApplyingRequestId(null)}
                                className="text-xs"
                              >
                                Cancel
                              </Button>
                              <Button
                                type="submit"
                                size="sm"
                                disabled={isSubmittingApp || !applicationMessage.trim()}
                                className="text-xs font-semibold gap-1.5"
                              >
                                <Send className="size-3.5" />
                                {isSubmittingApp ? "Sending..." : "Submit Application"}
                              </Button>
                            </div>
                          </form>
                        )}
                      </div>
                    );
                  })
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
