"use client";

import * as React from "react";
import Link from "next/link";
import { AppShell } from "@/components/layout/app-shell";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Avatar } from "@/components/ui/avatar";
import { initialProjects } from "@/lib/mock-data";
import { Project, ProjectStatus } from "@/lib/types";
import {
  FolderGit2,
  Plus,
  Search,
  ExternalLink,
  Users,
  GitBranch,
  Sparkles,
  ArrowRight,
} from "lucide-react";

const STATUS_FILTERS: { label: string; value: ProjectStatus | "ALL" }[] = [
  { label: "All Projects", value: "ALL" },
  { label: "In Development", value: "DEVELOPMENT" },
  { label: "Prototypes", value: "PROTOTYPE" },
  { label: "Planning", value: "PLANNING" },
  { label: "Ideas", value: "IDEA" },
  { label: "Completed", value: "COMPLETED" },
];

export default function ProjectsPage() {
  const [projects] = React.useState<Project[]>(initialProjects);
  const [activeStatus, setActiveStatus] = React.useState<ProjectStatus | "ALL">("ALL");
  const [searchQuery, setSearchQuery] = React.useState("");
  const [filterLookingForCollab, setFilterLookingForCollab] = React.useState(false);

  const filteredProjects = projects.filter((project) => {
    const matchesStatus =
      activeStatus === "ALL" || project.status === activeStatus;
    const matchesSearch =
      project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase())) ||
      project.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCollab = filterLookingForCollab
      ? (project.collaborationRequests && project.collaborationRequests.length > 0)
      : true;

    return matchesStatus && matchesSearch && matchesCollab;
  });

  const getStatusBadgeVariant = (status: ProjectStatus) => {
    switch (status) {
      case "DEVELOPMENT":
        return "default";
      case "PROTOTYPE":
        return "secondary";
      case "COMPLETED":
        return "success";
      case "PLANNING":
      case "IDEA":
        return "warning";
      default:
        return "outline";
    }
  };

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Header Title & CTA */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground flex items-center gap-2">
              <FolderGit2 className="size-7 text-primary" />
              Student Projects & Collaboration
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Discover university prototypes, open repositories, and teams looking for collaborators
            </p>
          </div>

          <Link href="/projects/new" className="shrink-0 self-start sm:self-auto">
            <Button className="font-semibold gap-1.5 shadow-md shadow-primary/20">
              <Plus className="size-4" />
              Create Project
            </Button>
          </Link>
        </div>

        {/* Filter & Search Controls */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-1">
          {/* Status Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            {STATUS_FILTERS.map((filter) => {
              const isActive = activeStatus === filter.value;
              return (
                <button
                  type="button"
                  key={filter.value}
                  onClick={() => setActiveStatus(filter.value)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors border cursor-pointer ${
                    isActive
                      ? "bg-primary text-primary-foreground border-primary shadow-xs"
                      : "bg-card/70 text-muted-foreground border-border hover:text-foreground hover:bg-muted/40"
                  }`}
                >
                  {filter.label}
                </button>
              );
            })}
          </div>

          {/* Search & Looking for Collab Toggle */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <label className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border bg-card/60 text-xs text-muted-foreground cursor-pointer select-none">
              <input
                type="checkbox"
                checked={filterLookingForCollab}
                onChange={(e) => setFilterLookingForCollab(e.target.checked)}
                className="size-3.5 rounded border-border text-primary focus:ring-primary accent-primary"
              />
              <span>Recruiting Teammates</span>
            </label>

            <div className="relative min-w-[220px]">
              <Search className="absolute left-3 top-2.5 size-4 text-muted-foreground" />
              <Input
                placeholder="Search projects, stack..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 h-9 text-xs"
              />
            </div>
          </div>
        </div>

        {/* Project Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredProjects.length === 0 ? (
            <div className="col-span-full">
              <Card className="p-12 text-center border-dashed border-border/80">
                <FolderGit2 className="size-10 text-muted-foreground mx-auto mb-3 opacity-50" />
                <h3 className="font-semibold text-foreground text-base">
                  No projects found
                </h3>
                <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
                  No projects match your filter query. Register your prototype or project to showcase it here!
                </p>
                <Link href="/projects/new">
                  <Button size="sm" className="mt-4">
                    Register New Project
                  </Button>
                </Link>
              </Card>
            </div>
          ) : (
            filteredProjects.map((project) => {
              const openCollabs = project.collaborationRequests?.filter((c) => c.status === "OPEN") || [];

              return (
                <Card
                  key={project.id}
                  className="bg-card/80 border-border/80 hover:border-primary/40 transition-all hover:shadow-md flex flex-col justify-between"
                >
                  <CardContent className="p-5 sm:p-6 space-y-4 flex-1 flex flex-col justify-between">
                    <div className="space-y-3">
                      {/* Top Row: Category and Status Badge */}
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground">
                          {project.category}
                        </span>

                        <Badge
                          variant={getStatusBadgeVariant(project.status)}
                          className="text-[10px] font-mono uppercase tracking-wider"
                        >
                          {project.status}
                        </Badge>
                      </div>

                      {/* Project Title */}
                      <Link href={`/projects/${project.id}`} className="group block">
                        <h2 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                          {project.name}
                        </h2>
                      </Link>

                      {/* Description */}
                      <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed line-clamp-3">
                        {project.description}
                      </p>

                      {/* Tech Tags */}
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {project.tags.map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-0.5 rounded-md bg-secondary border border-border/60 text-[10px] font-mono text-muted-foreground"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>

                      {/* Open Collaboration Notice Banner if applicable */}
                      {openCollabs.length > 0 && (
                        <div className="p-2.5 rounded-lg bg-primary/10 border border-primary/20 text-xs text-foreground flex items-center justify-between gap-2">
                          <span className="flex items-center gap-1.5 font-semibold text-primary text-[11px]">
                            <Users className="size-3.5" />
                            Recruiting Teammates
                          </span>
                          <span className="text-[11px] text-muted-foreground truncate max-w-[200px]">
                            {openCollabs[0].title}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Footer: Team Members & Actions */}
                    <div className="pt-4 border-t border-border/60 flex items-center justify-between text-xs mt-4">
                      {/* Member Avatars */}
                      <div className="flex items-center gap-2">
                        <div className="flex -space-x-2 overflow-hidden">
                          {project.members.map((member) => (
                            <Avatar
                              key={member.id}
                              fallback={member.user.name.slice(0, 2)}
                              className="size-7 border-2 border-card text-[10px] font-bold"
                            />
                          ))}
                        </div>
                        <span className="text-[11px] text-muted-foreground">
                          {project.members.length} {project.members.length === 1 ? "member" : "members"}
                        </span>
                      </div>

                      {/* View Details Link */}
                      <Link
                        href={`/projects/${project.id}`}
                        className="text-xs font-semibold text-primary hover:underline inline-flex items-center gap-1"
                      >
                        Project Details
                        <ArrowRight className="size-3.5" />
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>
      </div>
    </AppShell>
  );
}
