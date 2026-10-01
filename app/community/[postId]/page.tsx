"use client";

import * as React from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { AppShell } from "@/components/layout/app-shell";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Avatar } from "@/components/ui/avatar";
import { initialPosts, currentUserProfile } from "@/lib/mock-data";
import { Comment, Post } from "@/lib/types";
import {
  ArrowLeft,
  ThumbsUp,
  MessageSquare,
  Shield,
  Send,
  Calendar,
  Sparkles,
} from "lucide-react";

export default function PostDetailPage() {
  const params = useParams();
  const router = useRouter();
  const postId = params.postId as string;

  // Find post in initialPosts or fallback
  const foundPost = initialPosts.find((p) => p.id === postId) || initialPosts[0];
  const [post, setPost] = React.useState<Post>(foundPost);
  const [comments, setComments] = React.useState<Comment[]>(foundPost.comments || []);
  const [isUpvoted, setIsUpvoted] = React.useState(false);

  // New Comment Form State
  const [newCommentText, setNewCommentText] = React.useState("");
  const [isAnonymousComment, setIsAnonymousComment] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleToggleUpvote = () => {
    setIsUpvoted(!isUpvoted);
    setPost((prev) => ({
      ...prev,
      upvotes: isUpvoted ? prev.upvotes - 1 : prev.upvotes + 1,
    }));
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentText.trim()) return;

    setIsSubmitting(true);

    const newComment: Comment = {
      id: "c-" + Date.now(),
      postId: post.id,
      authorId: currentUserProfile.userId,
      author: {
        id: currentUserProfile.userId,
        name: isAnonymousComment
          ? "Anonymous Student"
          : `${currentUserProfile.firstName} ${currentUserProfile.lastName}`,
        username: isAnonymousComment ? "anonymous" : currentUserProfile.username,
        avatar: isAnonymousComment ? "" : currentUserProfile.profileImage,
        school: currentUserProfile.schoolName,
        course: currentUserProfile.course,
      },
      content: newCommentText,
      isAnonymous: isAnonymousComment,
      createdAt: new Date().toISOString(),
      upvotes: 1,
    };

    setTimeout(() => {
      setComments((prev) => [...prev, newComment]);
      setPost((prev) => ({ ...prev, commentsCount: prev.commentsCount + 1 }));
      setNewCommentText("");
      setIsAnonymousComment(false);
      setIsSubmitting(false);
    }, 400);
  };

  return (
    <AppShell>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Back Link */}
        <Link
          href="/community"
          className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors font-medium"
        >
          <ArrowLeft className="size-3.5" />
          Back to Community Feed
        </Link>

        {/* Main Post Card */}
        <Card className="bg-card/90 border-border/80 shadow-md">
          <CardContent className="p-6 sm:p-8 space-y-6">
            {/* Header info */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/60 pb-5">
              <div className="flex items-center gap-3">
                <Avatar
                  fallback={post.isAnonymous ? "AN" : post.author.name.slice(0, 2)}
                  className={`size-11 ${
                    post.isAnonymous
                      ? "border-amber-500/40 text-amber-400"
                      : "border-primary/40"
                  }`}
                />
                <div>
                  <div className="flex items-center gap-2">
                    {post.isAnonymous ? (
                      <span className="text-sm font-bold text-foreground flex items-center gap-1">
                        <Shield className="size-3.5 text-amber-400" />
                        Anonymous Student
                      </span>
                    ) : (
                      <Link
                        href={`/profile/${post.author.username}`}
                        className="text-sm font-bold text-foreground hover:text-primary transition-colors"
                      >
                        {post.author.name}
                      </Link>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {post.isAnonymous
                      ? "Verified Student Builder"
                      : `${post.author.school} • ${post.author.course}`}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Badge
                  variant={
                    post.postType === "QUESTION"
                      ? "warning"
                      : post.postType === "COLLABORATION"
                      ? "default"
                      : "secondary"
                  }
                  className="text-xs uppercase font-mono tracking-wider"
                >
                  {post.postType}
                </Badge>
                <span className="text-xs text-muted-foreground font-mono flex items-center gap-1">
                  <Calendar className="size-3" />
                  {new Date(post.createdAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
              </div>
            </div>

            {/* Post Title & Full Body */}
            <div className="space-y-4">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground leading-tight">
                {post.title}
              </h1>

              <div className="text-sm sm:text-base text-foreground/90 leading-relaxed whitespace-pre-line bg-secondary/20 p-4 sm:p-6 rounded-xl border border-border/50">
                {post.content}
              </div>
            </div>

            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-2">
                {post.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="font-mono text-xs">
                    #{tag}
                  </Badge>
                ))}
              </div>
            )}

            {/* Post Action Bar */}
            <div className="flex items-center justify-between pt-4 border-t border-border/60">
              <Button
                variant={isUpvoted ? "default" : "outline"}
                size="sm"
                onClick={handleToggleUpvote}
                className="gap-2 font-semibold"
              >
                <ThumbsUp className={`size-4 ${isUpvoted ? "fill-primary-foreground" : ""}`} />
                <span>{post.upvotes} Upvotes</span>
              </Button>

              <span className="text-xs text-muted-foreground flex items-center gap-1.5 font-medium">
                <MessageSquare className="size-4 text-primary" />
                {comments.length} Comments
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Comment Section Header */}
        <div className="pt-2">
          <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
            <MessageSquare className="size-5 text-primary" />
            Discussion Responses ({comments.length})
          </h2>
        </div>

        {/* Comment Input Card */}
        <Card className="bg-card/90 border-border/80">
          <CardContent className="p-5">
            <form onSubmit={handleAddComment} className="space-y-3">
              <Textarea
                rows={3}
                placeholder="Share your perspective, solution, or ask a follow-up question..."
                value={newCommentText}
                onChange={(e) => setNewCommentText(e.target.value)}
                required
              />

              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-1">
                {/* Anonymous Toggle for Comments */}
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={isAnonymousComment}
                    onChange={(e) => setIsAnonymousComment(e.target.checked)}
                    className="size-4 rounded border-border text-primary focus:ring-primary accent-primary"
                  />
                  <span className="text-xs text-muted-foreground flex items-center gap-1 font-medium">
                    <Shield className="size-3.5 text-amber-400" />
                    Reply as Anonymous Student
                  </span>
                </label>

                <Button
                  type="submit"
                  size="sm"
                  disabled={isSubmitting || !newCommentText.trim()}
                  className="font-semibold gap-1.5 self-end sm:self-auto shadow-sm"
                >
                  <Send className="size-3.5" />
                  {isSubmitting ? "Posting..." : "Post Response"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Comments List */}
        <div className="space-y-3">
          {comments.length === 0 ? (
            <Card className="p-8 text-center border-dashed border-border/80 text-muted-foreground text-xs">
              No replies yet. Be the first to join the conversation!
            </Card>
          ) : (
            comments.map((comment) => (
              <Card key={comment.id} className="bg-card/70 border-border/80">
                <CardContent className="p-4 sm:p-5 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <Avatar
                        fallback={
                          comment.isAnonymous
                            ? "AN"
                            : comment.author.name.slice(0, 2)
                        }
                        className={`size-8 text-xs ${
                          comment.isAnonymous
                            ? "border-amber-500/40 text-amber-400"
                            : "border-primary/30"
                        }`}
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-foreground">
                            {comment.isAnonymous
                              ? "Anonymous Student"
                              : comment.author.name}
                          </span>
                          {comment.isAnonymous && (
                            <Badge
                              variant="outline"
                              className="text-[9px] py-0 px-1 text-amber-400 border-amber-400/30"
                            >
                              Anonymous
                            </Badge>
                          )}
                        </div>
                        <span className="text-[10px] text-muted-foreground">
                          {comment.isAnonymous
                            ? "Verified Student"
                            : `${comment.author.school} • ${comment.author.course}`}
                        </span>
                      </div>
                    </div>

                    <span className="text-[10px] text-muted-foreground font-mono">
                      {new Date(comment.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm text-foreground/90 leading-relaxed pl-10 whitespace-pre-line">
                    {comment.content}
                  </p>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </AppShell>
  );
}
