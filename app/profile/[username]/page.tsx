"use client";

import * as React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { AppShell } from "@/components/layout/app-shell";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { currentUserProfile, initialPosts, initialProjects } from "@/lib/mock-data";
import { ProjectStatus } from "@/lib/types";
import {
  School,
  GraduationCap,
  Calendar,
  Settings,
  MessageSquare,
  ThumbsUp,
  FolderGit2,
  ExternalLink,
  Code2,
  Users,
  Plus,
  GitBranch,
} from "lucide-react";

export default function StudentProfilePage() {
  const params = useParams();
  const username = params.username as string;

  const profile = currentUserProfile; // Default to current student profile
  const isOwnProfile = username === profile.username || username === "sample";

  // Filter posts by this user
  const userPosts = initialPosts.filter(
    (p) => !p.isAnonymous && p.author.username === profile.username
  );

  // Filter projects by this user (either owner or member)
  const userProjects = initialProjects.filter(
    (p) => p.ownerId === profile.userId || p.members.some((m) => m.userId === profile.userId)
  );

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
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Profile Header Banner */}
        <Card className="border-border/80 bg-card overflow-hidden shadow-md">
          {/* Banner Graphic */}
          <div className="h-32 sm:h-44 bg-gradient-to-r from-secondary via-card to-primary/20 relative border-b border-border/60">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(92,214,215,0.15),transparent)]" />
          </div>

          <CardContent className="p-6 sm:p-8 pt-0 relative">
            <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 -mt-16 sm:-mt-20 mb-5">
              {/* Profile Avatar */}
              <div className="relative">
                <Avatar
                  fallback="GV"
                  className="size-28 sm:size-32 rounded-2xl border-4 border-card text-2xl font-black bg-secondary shadow-lg"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2.5 w-full sm:w-auto">
                {isOwnProfile ? (
                  <Link href="/profile/settings" className="w-full sm:w-auto">
                    <Button variant="outline" size="sm" className="w-full sm:w-auto gap-2 font-semibold">
                      <Settings className="size-4" />
                      Edit Profile
                    </Button>
                  </Link>
                ) : (
                  <Button size="sm" className="w-full sm:w-auto font-semibold">
                    Connect / Message
                  </Button>
                )}
              </div>
            </div>

            {/* Profile Bio & Metadata */}
            <div className="space-y-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground">
                  {profile.firstName} {profile.lastName}
                </h1>
                <p className="text-sm font-mono text-primary font-semibold">
                  @{profile.username}
                </p>
              </div>

              <p className="text-sm sm:text-base text-foreground/90 max-w-3xl leading-relaxed">
                {profile.bio}
              </p>

              {/* Student Metadata Chips */}
              <div className="flex flex-wrap items-center gap-y-2 gap-x-4 text-xs text-muted-foreground pt-1">
                <span className="flex items-center gap-1.5 font-medium text-foreground">
                  <School className="size-4 text-primary" />
                  {profile.schoolName}
                </span>

                <span className="text-muted-foreground">•</span>

                <span className="flex items-center gap-1.5 font-medium">
                  <GraduationCap className="size-4 text-primary" />
                  {profile.course} ({profile.yearLevel})
                </span>

                <span className="text-muted-foreground">•</span>

                <span className="flex items-center gap-1.5">
                  <Calendar className="size-3.5" />
                  Member since Sept 2026
                </span>
              </div>

              {/* Social Links */}
              <div className="flex items-center gap-3 pt-2">
                {profile.githubUrl && (
                  <a
                    href={profile.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-secondary/50 text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
                  >
                    <svg className="size-3.5 fill-current" viewBox="0 0 24 24">
                      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                    </svg>
                    GitHub
                  </a>
                )}
                {profile.linkedinUrl && (
                  <a
                    href={profile.linkedinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-secondary/50 text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
                  >
                    <svg className="size-3.5 fill-current" viewBox="0 0 24 24">
                      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
                    </svg>
                    LinkedIn
                  </a>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Profile Content Tabs */}
        <Tabs defaultValue="posts">
          <TabsList className="w-full justify-start border-b border-border/80 bg-transparent p-0 rounded-none h-auto gap-4">
            <TabsTrigger
              value="posts"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-2.5 text-sm font-semibold"
            >
              Discussions & Posts
            </TabsTrigger>
            <TabsTrigger
              value="skills"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-2.5 text-sm font-semibold"
            >
              Skills & Interests
            </TabsTrigger>
            <TabsTrigger
              value="projects"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-2.5 text-sm font-semibold"
            >
              Projects & Prototypes
            </TabsTrigger>
          </TabsList>

          {/* Posts Tab Content */}
          <TabsContent value="posts" className="space-y-4 pt-4">
            {userPosts.length === 0 ? (
              <Card className="p-8 text-center border-dashed border-border/80 text-muted-foreground text-xs">
                No public posts created yet.
              </Card>
            ) : (
              userPosts.map((post) => (
                <Card key={post.id} className="bg-card/70 border-border/80 hover:border-primary/40 transition-colors">
                  <CardContent className="p-5 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <Badge variant="secondary" className="text-[10px] font-mono">
                        {post.postType}
                      </Badge>
                      <span className="text-[11px] text-muted-foreground font-mono">
                        {new Date(post.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    <Link href={`/community/${post.id}`} className="block group">
                      <h3 className="font-bold text-base text-foreground group-hover:text-primary transition-colors">
                        {post.title}
                      </h3>
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                        {post.content}
                      </p>
                    </Link>

                    <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t border-border/40">
                      <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1">
                          <ThumbsUp className="size-3 text-primary" />
                          {post.upvotes}
                        </span>
                        <span className="flex items-center gap-1">
                          <MessageSquare className="size-3" />
                          {post.commentsCount}
                        </span>
                      </div>
                      <Link href={`/community/${post.id}`} className="text-primary hover:underline font-medium inline-flex items-center gap-1">
                        View Thread <ExternalLink className="size-3" />
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          {/* Skills & Interests Tab Content */}
          <TabsContent value="skills" className="space-y-6 pt-4">
            <Card className="bg-card/70 border-border/80 p-6 space-y-5">
              <div>
                <h3 className="text-sm font-bold text-foreground uppercase tracking-wider mb-3">
                  Verified Technical Skills
                </h3>
                <div className="flex flex-wrap gap-2">
                  {profile.skills.map((skill) => (
                    <Badge key={skill} variant="default" className="text-xs py-1 px-3 font-semibold">
                      <Code2 className="size-3 mr-1.5" />
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="border-t border-border/60 pt-5">
                <h3 className="text-sm font-bold text-foreground uppercase tracking-wider mb-3">
                  Community Interests & Domains
                </h3>
                <div className="flex flex-wrap gap-2">
                  {profile.interests.map((interest) => (
                    <Badge key={interest} variant="secondary" className="text-xs py-1 px-3">
                      #{interest}
                    </Badge>
                  ))}
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* Projects Tab Content */}
          <TabsContent value="projects" className="space-y-4 pt-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-muted-foreground">
                Showing {userProjects.length} project{userProjects.length === 1 ? "" : "s"}
              </span>
              {isOwnProfile && (
                <Link href="/projects/new">
                  <Button size="sm" className="font-semibold text-xs h-8">
                    <Plus className="size-3.5 mr-1" /> New Project
                  </Button>
                </Link>
              )}
            </div>

            {userProjects.length === 0 ? (
              <Card className="bg-card/70 border-dashed border-border/80 p-8 text-center space-y-3">
                <FolderGit2 className="size-10 text-muted-foreground mx-auto opacity-50" />
                <h3 className="font-bold text-foreground text-sm">
                  No projects published yet
                </h3>
                <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                  Showcase your university prototypes, hackathon submissions, and open-source repos here.
                </p>
                {isOwnProfile && (
                  <Link href="/projects/new">
                    <Button size="sm" variant="outline" className="mt-2 font-semibold">
                      <Plus className="size-3.5 mr-1.5" /> Register a Project
                    </Button>
                  </Link>
                )}
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {userProjects.map((project) => (
                  <Card
                    key={project.id}
                    className="bg-card/70 border-border/80 hover:border-primary/40 transition-colors flex flex-col justify-between"
                  >
                    <CardContent className="p-5 space-y-3">
                      <div className="flex items-start justify-between gap-2">
                        <Badge
                          variant={getStatusBadgeVariant(project.status)}
                          className="text-[10px] font-mono tracking-wider uppercase"
                        >
                          {project.status}
                        </Badge>
                        <span className="text-[11px] text-muted-foreground font-mono">
                          {project.category}
                        </span>
                      </div>

                      <div>
                        <Link
                          href={`/projects/${project.id}`}
                          className="font-bold text-base text-foreground hover:text-primary transition-colors block"
                        >
                          {project.name}
                        </Link>
                        <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                          {project.description}
                        </p>
                      </div>

                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {project.tags.slice(0, 3).map((tag) => (
                          <span
                            key={tag}
                            className="text-[10px] font-mono bg-secondary/80 text-secondary-foreground px-2 py-0.5 rounded"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>

                      <div className="flex items-center justify-between text-xs text-muted-foreground pt-3 border-t border-border/40">
                        <span className="flex items-center gap-1.5 font-mono text-[11px]">
                          <Users className="size-3.5 text-primary" />
                          {project.members.length} member{project.members.length === 1 ? "" : "s"}
                        </span>
                        <Link
                          href={`/projects/${project.id}`}
                          className="text-primary hover:underline font-medium inline-flex items-center gap-1 text-xs"
                        >
                          View Project <ExternalLink className="size-3" />
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </AppShell>
  );
}
