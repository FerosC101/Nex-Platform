"use client";

import * as React from "react";
import Link from "next/link";
import { AppShell } from "@/components/layout/app-shell";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar } from "@/components/ui/avatar";
import { initialPosts, currentUserProfile } from "@/lib/mock-data";
import { Post, PostType } from "@/lib/types";
import {
  MessageSquare,
  ThumbsUp,
  Share2,
  Plus,
  Search,
  Filter,
  Shield,
  Send,
  Sparkles,
  ExternalLink,
} from "lucide-react";

const CATEGORIES: { label: string; value: PostType | "ALL" }[] = [
  { label: "All Posts", value: "ALL" },
  { label: "Discussions", value: "DISCUSSION" },
  { label: "Questions", value: "QUESTION" },
  { label: "Collaborations", value: "COLLABORATION" },
  { label: "Project Showcases", value: "PROJECT" },
  { label: "Opportunities", value: "OPPORTUNITY" },
  { label: "Announcements", value: "ANNOUNCEMENT" },
];

export default function CommunityPage() {
  const [posts, setPosts] = React.useState<Post[]>(initialPosts);
  const [activeCategory, setActiveCategory] = React.useState<PostType | "ALL">("ALL");
  const [searchQuery, setSearchQuery] = React.useState("");
  const [isCreatingPost, setIsCreatingPost] = React.useState(false);

  // Form State
  const [title, setTitle] = React.useState("");
  const [content, setContent] = React.useState("");
  const [postType, setPostType] = React.useState<PostType>("DISCUSSION");
  const [isAnonymous, setIsAnonymous] = React.useState(false);
  const [tagInput, setTagInput] = React.useState("");
  const [upvotedPostIds, setUpvotedPostIds] = React.useState<string[]>([]);

  // Filter logic
  const filteredPosts = posts.filter((post) => {
    const matchesCategory =
      activeCategory === "ALL" || post.postType === activeCategory;
    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  // Upvote toggle
  const handleToggleUpvote = (postId: string) => {
    const alreadyUpvoted = upvotedPostIds.includes(postId);
    setUpvotedPostIds((prev) =>
      alreadyUpvoted ? prev.filter((id) => id !== postId) : [...prev, postId]
    );

    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          return {
            ...p,
            upvotes: alreadyUpvoted ? p.upvotes - 1 : p.upvotes + 1,
          };
        }
        return p;
      })
    );
  };

  // Create post submit
  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    const parsedTags = tagInput
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    const newPost: Post = {
      id: "post-" + Date.now(),
      authorId: currentUserProfile.userId,
      author: {
        id: currentUserProfile.userId,
        name: `${currentUserProfile.firstName} ${currentUserProfile.lastName}`,
        username: currentUserProfile.username,
        avatar: currentUserProfile.profileImage,
        school: currentUserProfile.schoolName,
        course: currentUserProfile.course,
      },
      title,
      content,
      postType,
      isAnonymous,
      upvotes: 1,
      commentsCount: 0,
      createdAt: new Date().toISOString(),
      tags: parsedTags.length > 0 ? parsedTags : ["Community"],
      comments: [],
    };

    setPosts([newPost, ...posts]);
    setUpvotedPostIds((prev) => [...prev, newPost.id]);

    // Reset form
    setTitle("");
    setContent("");
    setTagInput("");
    setIsAnonymous(false);
    setIsCreatingPost(false);
  };

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Header Title & CTA */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground flex items-center gap-2">
              <MessageSquare className="size-7 text-primary" />
              Community Discussions
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Ask questions, discuss frameworks, form hackathon teams, and share project wins
            </p>
          </div>

          <Button
            onClick={() => setIsCreatingPost(!isCreatingPost)}
            className="font-semibold gap-1.5 shadow-md shadow-primary/20 shrink-0 self-start sm:self-auto"
          >
            <Plus className="size-4" />
            {isCreatingPost ? "Close Composer" : "Start New Discussion"}
          </Button>
        </div>

        {/* Create Post Drawer / Form */}
        {isCreatingPost && (
          <Card className="border-primary/40 bg-card shadow-xl transition-all animate-in fade-in slide-in-from-top-2">
            <CardHeader className="p-5 pb-3 border-b border-border/60">
              <CardTitle className="text-base font-bold text-foreground flex items-center gap-2">
                <Sparkles className="size-4 text-primary" />
                Create New Community Post
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5">
              <form onSubmit={handleCreatePost} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {/* Category Dropdown */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                      Post Type *
                    </label>
                    <select
                      value={postType}
                      onChange={(e) => setPostType(e.target.value as PostType)}
                      className="flex h-10 w-full rounded-lg border border-border bg-card/60 px-3 py-2 text-xs text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:border-primary cursor-pointer"
                    >
                      <option value="DISCUSSION" className="bg-card text-foreground">Discussion</option>
                      <option value="QUESTION" className="bg-card text-foreground">Technical Question</option>
                      <option value="COLLABORATION" className="bg-card text-foreground">Teammate Search</option>
                      <option value="PROJECT" className="bg-card text-foreground">Project Showcase</option>
                      <option value="OPPORTUNITY" className="bg-card text-foreground">Opportunity / Hackathon</option>
                      <option value="ANNOUNCEMENT" className="bg-card text-foreground">Announcement</option>
                    </select>
                  </div>

                  {/* Tags Input */}
                  <div className="sm:col-span-2 space-y-1">
                    <label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                      Tags (comma separated)
                    </label>
                    <Input
                      placeholder="e.g. Next.js, FastAPI, Hackathon, Capstone"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                    />
                  </div>
                </div>

                {/* Title */}
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                    Title *
                  </label>
                  <Input
                    placeholder="Clear summary of your topic or question..."
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                </div>

                {/* Content */}
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                    Body Content *
                  </label>
                  <Textarea
                    rows={4}
                    placeholder="Provide full details, context, code snippets, or team requirements..."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    required
                  />
                </div>

                {/* Anonymous Posting Option (Spec Section 10 Requirement) */}
                <div className="p-3.5 rounded-xl border border-border/80 bg-secondary/30 flex items-center justify-between gap-4">
                  <div className="flex items-start gap-2.5">
                    <Shield className={`size-5 mt-0.5 ${isAnonymous ? "text-primary" : "text-muted-foreground"}`} />
                    <div>
                      <p className="text-xs font-semibold text-foreground">
                        Post Anonymously
                      </p>
                      <p className="text-[11px] text-muted-foreground">
                        Hides your name and school from fellow students to keep questions pressure-free.
                      </p>
                    </div>
                  </div>

                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isAnonymous}
                      onChange={(e) => setIsAnonymous(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary"></div>
                  </label>
                </div>

                {/* Submit & Cancel */}
                <div className="flex items-center justify-end gap-3 pt-1">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsCreatingPost(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" size="sm" className="font-semibold gap-1.5">
                    <Send className="size-3.5" />
                    Publish Post
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Filter & Search Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2">
          {/* Category Chips Scroll */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            {CATEGORIES.map((cat) => {
              const isActive = activeCategory === cat.value;
              return (
                <button
                  type="button"
                  key={cat.value}
                  onClick={() => setActiveCategory(cat.value)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors border cursor-pointer ${
                    isActive
                      ? "bg-primary text-primary-foreground border-primary shadow-xs"
                      : "bg-card/70 text-muted-foreground border-border hover:text-foreground hover:bg-muted/40"
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>

          {/* Search Input */}
          <div className="relative min-w-[240px]">
            <Search className="absolute left-3 top-2.5 size-4 text-muted-foreground" />
            <Input
              placeholder="Search topics, tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-9 text-xs"
            />
          </div>
        </div>

        {/* Posts List Feed */}
        <div className="space-y-4">
          {filteredPosts.length === 0 ? (
            <Card className="p-12 text-center border-dashed border-border/80">
              <MessageSquare className="size-10 text-muted-foreground mx-auto mb-3 opacity-50" />
              <h3 className="font-semibold text-foreground text-base">
                No discussions found
              </h3>
              <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
                No posts match your selected filter. Be the first to start a conversation!
              </p>
              <Button
                size="sm"
                variant="outline"
                className="mt-4"
                onClick={() => {
                  setActiveCategory("ALL");
                  setSearchQuery("");
                }}
              >
                Reset Filters
              </Button>
            </Card>
          ) : (
            filteredPosts.map((post) => {
              const isUpvoted = upvotedPostIds.includes(post.id);

              return (
                <Card
                  key={post.id}
                  className="bg-card/80 border-border/80 hover:border-primary/40 transition-all hover:shadow-md"
                >
                  <CardContent className="p-5 sm:p-6 space-y-4">
                    {/* Header: Author & Tag */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <Avatar
                          fallback={post.isAnonymous ? "AN" : post.author.name.slice(0, 2)}
                          className={post.isAnonymous ? "border-amber-500/40 text-amber-400" : "border-primary/30"}
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            {post.isAnonymous ? (
                              <span className="text-xs font-bold text-foreground flex items-center gap-1">
                                <Shield className="size-3 text-amber-400" />
                                Anonymous Student
                              </span>
                            ) : (
                              <Link
                                href={`/profile/${post.author.username}`}
                                className="text-xs font-bold text-foreground hover:text-primary transition-colors"
                              >
                                {post.author.name}
                              </Link>
                            )}

                            <span className="text-muted-foreground text-[10px]">•</span>

                            <span className="text-[11px] text-muted-foreground font-mono">
                              {new Date(post.createdAt).toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                              })}
                            </span>
                          </div>

                          <span className="text-[11px] text-muted-foreground">
                            {post.isAnonymous ? "Verified University Student" : `${post.author.school} • ${post.author.course}`}
                          </span>
                        </div>
                      </div>

                      <Badge
                        variant={
                          post.postType === "QUESTION"
                            ? "warning"
                            : post.postType === "COLLABORATION"
                            ? "default"
                            : post.postType === "OPPORTUNITY"
                            ? "success"
                            : "secondary"
                        }
                        className="text-[10px] font-mono uppercase tracking-wider shrink-0"
                      >
                        {post.postType}
                      </Badge>
                    </div>

                    {/* Post Content */}
                    <div className="space-y-2">
                      <Link href={`/community/${post.id}`} className="group block">
                        <h2 className="text-lg sm:text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                          {post.title}
                        </h2>
                      </Link>

                      <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
                        {post.content}
                      </p>
                    </div>

                    {/* Tags */}
                    {post.tags && post.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {post.tags.map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-0.5 rounded-md bg-secondary/80 border border-border/60 text-[10px] text-muted-foreground font-mono"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Footer Actions */}
                    <div className="flex items-center justify-between pt-3 border-t border-border/60 text-xs">
                      <div className="flex items-center gap-2">
                        {/* Upvote Button */}
                        <button
                          type="button"
                          onClick={() => handleToggleUpvote(post.id)}
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold transition-colors cursor-pointer ${
                            isUpvoted
                              ? "bg-primary/15 text-primary border-primary/40 font-bold"
                              : "bg-secondary/40 text-muted-foreground border-border hover:text-foreground hover:bg-muted/40"
                          }`}
                        >
                          <ThumbsUp className={`size-3.5 ${isUpvoted ? "fill-primary" : ""}`} />
                          <span>{post.upvotes}</span>
                        </button>

                        {/* Comments Link */}
                        <Link
                          href={`/community/${post.id}`}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-secondary/40 text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-colors"
                        >
                          <MessageSquare className="size-3.5" />
                          <span>{post.commentsCount} comments</span>
                        </Link>
                      </div>

                      <Link
                        href={`/community/${post.id}`}
                        className="text-xs font-semibold text-primary hover:underline inline-flex items-center gap-1"
                      >
                        Join Discussion
                        <ExternalLink className="size-3" />
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
