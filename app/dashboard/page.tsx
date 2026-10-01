"use client";

import * as React from "react";
import Link from "next/link";
import { AppShell } from "@/components/layout/app-shell";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { currentUserProfile, initialPosts } from "@/lib/mock-data";
import {
  MessageSquare,
  Users,
  Compass,
  ArrowRight,
  Plus,
  Sparkles,
  Calendar,
  ExternalLink,
  ThumbsUp,
  School,
} from "lucide-react";

export default function DashboardPage() {
  const [posts] = React.useState(initialPosts);

  return (
    <AppShell>
      <div className="space-y-8">
        {/* Welcome Banner */}
        <div className="rounded-2xl border border-border/80 bg-gradient-to-r from-card via-card to-secondary/30 p-6 sm:p-8 relative overflow-hidden">
          <div className="absolute right-0 top-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none -z-0" />

          <div className="relative z-10 max-w-2xl space-y-3">
            <div className="flex items-center gap-2">
              <Badge variant="default" className="text-[11px] font-semibold">
                <Sparkles className="size-3 mr-1 inline" />
                Student Builder Hub
              </Badge>
              <span className="text-xs text-muted-foreground flex items-center gap-1 font-mono">
                <School className="size-3 text-primary" />
                {currentUserProfile.schoolName}
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-foreground">
              Welcome back,{" "}
              <span className="text-primary">{currentUserProfile.firstName}</span>!
            </h1>

            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
              Explore ongoing campus projects, ask technical questions, or connect with teammates for upcoming hackathons.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <Link href="/community">
                <Button size="sm" className="font-semibold gap-1.5 shadow-sm">
                  <Plus className="size-4" />
                  Ask Question or Share Post
                </Button>
              </Link>
              <Link href="/projects">
                <Button variant="outline" size="sm" className="font-semibold gap-1.5">
                  Browse Student Projects
                  <ArrowRight className="size-3.5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card className="bg-card/70 border-border/80 hover:border-primary/40 transition-colors">
            <CardContent className="p-5 flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Active Discussions
                </p>
                <h3 className="text-2xl font-bold text-foreground mt-1">28</h3>
                <p className="text-[11px] text-emerald-400 mt-0.5">
                  +6 new today
                </p>
              </div>
              <div className="size-11 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                <MessageSquare className="size-5" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card/70 border-border/80 hover:border-primary/40 transition-colors">
            <CardContent className="p-5 flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Open Collab Requests
                </p>
                <h3 className="text-2xl font-bold text-foreground mt-1">12</h3>
                <p className="text-[11px] text-primary mt-0.5">
                  PacketHacks & Capstone
                </p>
              </div>
              <div className="size-11 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                <Users className="size-5" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card/70 border-border/80 hover:border-primary/40 transition-colors">
            <CardContent className="p-5 flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Upcoming Deadlines
                </p>
                <h3 className="text-2xl font-bold text-foreground mt-1">3</h3>
                <p className="text-[11px] text-amber-400 mt-0.5">
                  Next: DOST Challenge (Oct 25)
                </p>
              </div>
              <div className="size-11 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                <Compass className="size-5" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 2-Column Main Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Recent Community Posts (8 cols) */}
          <div className="lg:col-span-8 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-foreground">
                  Trending Community Posts
                </h2>
                <p className="text-xs text-muted-foreground">
                  Discussions, questions, and team recruitment from student builders
                </p>
              </div>
              <Link href="/community">
                <Button variant="ghost" size="sm" className="text-xs text-primary gap-1">
                  View Feed <ArrowRight className="size-3.5" />
                </Button>
              </Link>
            </div>

            <div className="space-y-3">
              {posts.map((post) => (
                <Card
                  key={post.id}
                  className="bg-card/70 border-border/80 hover:border-primary/40 transition-all hover:shadow-md"
                >
                  <CardContent className="p-5 space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <Avatar
                          fallback={post.isAnonymous ? "AN" : post.author.name.slice(0, 2)}
                          className={post.isAnonymous ? "border-amber-500/40 text-amber-400" : "border-primary/30"}
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-semibold text-foreground">
                              {post.isAnonymous ? "Anonymous Student" : post.author.name}
                            </span>
                            {post.isAnonymous && (
                              <Badge variant="outline" className="text-[10px] py-0 px-1 text-muted-foreground">
                                Anonymous
                              </Badge>
                            )}
                          </div>
                          <span className="text-[11px] text-muted-foreground">
                            {post.author.school} • {post.author.course}
                          </span>
                        </div>
                      </div>

                      <Badge
                        variant={
                          post.postType === "QUESTION"
                            ? "warning"
                            : post.postType === "COLLABORATION"
                            ? "default"
                            : "secondary"
                        }
                        className="text-[10px] uppercase font-mono tracking-wider"
                      >
                        {post.postType}
                      </Badge>
                    </div>

                    <Link href={`/community/${post.id}`} className="block group">
                      <h3 className="font-semibold text-base text-foreground group-hover:text-primary transition-colors">
                        {post.title}
                      </h3>
                      <p className="text-xs text-muted-foreground line-clamp-2 mt-1 leading-relaxed">
                        {post.content}
                      </p>
                    </Link>

                    <div className="flex items-center justify-between text-xs text-muted-foreground pt-1 border-t border-border/40">
                      <div className="flex items-center gap-4">
                        <span className="flex items-center gap-1">
                          <ThumbsUp className="size-3 text-primary" />
                          {post.upvotes} upvotes
                        </span>
                        <span className="flex items-center gap-1">
                          <MessageSquare className="size-3" />
                          {post.commentsCount} comments
                        </span>
                      </div>

                      <Link
                        href={`/community/${post.id}`}
                        className="text-xs text-primary hover:underline font-medium inline-flex items-center gap-1"
                      >
                        Open Discussion
                        <ExternalLink className="size-3" />
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Right Column: Profile Summary & Upcoming Events (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            {/* Student Profile Snapshot */}
            <Card className="bg-card/80 border-border/80">
              <CardHeader className="p-5 pb-3">
                <CardTitle className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                  Your Student Profile
                </CardTitle>
              </CardHeader>
              <CardContent className="p-5 pt-0 space-y-4">
                <div className="flex items-center gap-3">
                  <Avatar fallback="GV" className="size-12 border-primary/40 text-sm font-bold" />
                  <div>
                    <h3 className="font-bold text-foreground text-sm">
                      {currentUserProfile.firstName} {currentUserProfile.lastName}
                    </h3>
                    <p className="text-xs text-primary font-mono">
                      @{currentUserProfile.username}
                    </p>
                    <p className="text-[11px] text-muted-foreground">
                      {currentUserProfile.course} • {currentUserProfile.yearLevel}
                    </p>
                  </div>
                </div>

                <p className="text-xs text-muted-foreground line-clamp-3 leading-relaxed">
                  {currentUserProfile.bio}
                </p>

                {/* Skills tags */}
                <div className="flex flex-wrap gap-1">
                  {currentUserProfile.skills.map((skill) => (
                    <Badge key={skill} variant="secondary" className="text-[10px] py-0 px-2">
                      {skill}
                    </Badge>
                  ))}
                </div>

                <div className="pt-2 flex gap-2">
                  <Link href={`/profile/${currentUserProfile.username}`} className="w-full">
                    <Button variant="outline" size="sm" className="w-full text-xs font-semibold">
                      View Full Profile
                    </Button>
                  </Link>
                  <Link href="/profile/settings">
                    <Button variant="ghost" size="sm" className="text-xs">
                      Edit
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* Upcoming Hackathons / Deadlines */}
            <Card className="bg-card/80 border-border/80">
              <CardHeader className="p-5 pb-3 flex flex-row items-center justify-between">
                <CardTitle className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                  Events & Deadlines
                </CardTitle>
                <Calendar className="size-4 text-primary" />
              </CardHeader>
              <CardContent className="p-5 pt-0 space-y-3.5">
                <div className="p-3 rounded-lg bg-secondary/50 border border-border/80 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-foreground">
                      PacketHacks 2026
                    </span>
                    <Badge variant="warning" className="text-[9px] py-0">
                      14 days left
                    </Badge>
                  </div>
                  <p className="text-[11px] text-muted-foreground">
                    National Student Hackathon • Online & Finals in Manila
                  </p>
                </div>

                <div className="p-3 rounded-lg bg-secondary/50 border border-border/80 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-foreground">
                      DOST Student Innovation Grant
                    </span>
                    <Badge variant="default" className="text-[9px] py-0">
                      Open
                    </Badge>
                  </div>
                  <p className="text-[11px] text-muted-foreground">
                    Up to ₱100k prototyping grant for university teams
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
