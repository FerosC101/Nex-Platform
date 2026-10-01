"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AppShell } from "@/components/layout/app-shell";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ProjectStatus } from "@/lib/types";
import { currentUserProfile } from "@/lib/mock-data";
import {
  FolderGit2,
  ArrowLeft,
  ArrowRight,
  GitBranch,
  Globe,
  Sparkles,
  Users,
} from "lucide-react";

export default function CreateProjectPage() {
  const router = useRouter();

  const [formData, setFormData] = React.useState({
    name: "",
    description: "",
    category: "Web & Developer Tools",
    status: "DEVELOPMENT" as ProjectStatus,
    repositoryUrl: "",
    demoUrl: "",
    tags: "",
    // Optional Teammate Recruitment
    isRecruiting: false,
    collabTitle: "",
    collabSkills: "",
  });

  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [error, setError] = React.useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!formData.name.trim() || !formData.description.trim()) {
      setError("Please fill in both project name and description.");
      return;
    }

    setIsSubmitting(true);
    // Simulate project registration and redirect to projects directory
    setTimeout(() => {
      setIsSubmitting(false);
      router.push("/projects");
    }, 600);
  };

  return (
    <AppShell>
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Back Link */}
        <Link
          href="/projects"
          className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors font-medium"
        >
          <ArrowLeft className="size-3.5" />
          Back to Projects Directory
        </Link>

        <Card className="border-border/80 bg-card shadow-xl">
          <CardHeader className="border-b border-border/60 p-6">
            <CardTitle className="text-xl font-bold text-foreground flex items-center gap-2">
              <FolderGit2 className="size-6 text-primary" />
              Register New Student Project
            </CardTitle>
            <CardDescription className="text-xs text-muted-foreground">
              Showcase your prototype, connect repositories, or recruit university collaborators
            </CardDescription>
          </CardHeader>

          <CardContent className="p-6">
            {error && (
              <div className="mb-4 p-3 rounded-lg bg-destructive/15 border border-destructive/30 text-destructive text-xs font-semibold">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Project Name */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Project Title *
                </label>
                <Input
                  name="name"
                  placeholder="e.g. AgriSense, CampusLogix, StudySync"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Category & Status */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Category *
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="flex h-10 w-full rounded-lg border border-border bg-card/60 px-3 py-2 text-xs text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:border-primary cursor-pointer"
                  >
                    <option value="Web & Developer Tools">Web & Developer Tools</option>
                    <option value="Hardware & IoT">Hardware & IoT</option>
                    <option value="Mobile & EdTech">Mobile & EdTech</option>
                    <option value="AI & Machine Learning">AI & Machine Learning</option>
                    <option value="Smart Campus & Transit">Smart Campus & Transit</option>
                    <option value="FinTech & E-Commerce">FinTech & E-Commerce</option>
                    <option value="Healthcare & BioTech">Healthcare & BioTech</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Project Stage / Status *
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="flex h-10 w-full rounded-lg border border-border bg-card/60 px-3 py-2 text-xs text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:border-primary cursor-pointer"
                  >
                    <option value="IDEA">Idea (Concept / Brainstorming)</option>
                    <option value="PLANNING">Planning (Architecture / Wireframes)</option>
                    <option value="PROTOTYPE">Prototype (Initial MVP Working)</option>
                    <option value="DEVELOPMENT">Development (Active Coding)</option>
                    <option value="COMPLETED">Completed (Shipped / Deployed)</option>
                  </select>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Project Description & Vision *
                </label>
                <Textarea
                  name="description"
                  rows={4}
                  placeholder="What problem does this project solve? What technologies are used?"
                  value={formData.description}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Tech Stack Tags */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Tech Stack (comma-separated)
                </label>
                <Input
                  name="tags"
                  placeholder="e.g. Next.js, FastAPI, ESP32, Tailwind CSS, PostgreSQL"
                  value={formData.tags}
                  onChange={handleChange}
                />
              </div>

              {/* Links: Repository & Demo */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-border/60 pt-5">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                    <GitBranch className="size-3.5 text-primary" />
                    GitHub / Repo URL
                  </label>
                  <Input
                    name="repositoryUrl"
                    placeholder="https://github.com/org/repo"
                    value={formData.repositoryUrl}
                    onChange={handleChange}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                    <Globe className="size-3.5 text-primary" />
                    Live Demo / Vercel URL
                  </label>
                  <Input
                    name="demoUrl"
                    placeholder="https://myproject.vercel.app"
                    value={formData.demoUrl}
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* Teammate Recruitment Toggle (Spec Section 12) */}
              <div className="border-t border-border/60 pt-5 space-y-4">
                <div className="p-4 rounded-xl border border-border/80 bg-secondary/30 flex items-center justify-between gap-4">
                  <div className="flex items-start gap-2.5">
                    <Users className="size-5 text-primary mt-0.5" />
                    <div>
                      <p className="text-xs font-bold text-foreground">
                        Looking for Teammates or Collaborators?
                      </p>
                      <p className="text-[11px] text-muted-foreground">
                        Creates an open collaboration request on your project for student developers to apply.
                      </p>
                    </div>
                  </div>

                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isRecruiting}
                      onChange={(e) =>
                        setFormData({ ...formData, isRecruiting: e.target.checked })
                      }
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary"></div>
                  </label>
                </div>

                {formData.isRecruiting && (
                  <div className="p-4 rounded-xl border border-primary/30 bg-primary/5 space-y-3 animate-in fade-in slide-in-from-top-1">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-foreground">
                        Role Title Needed *
                      </label>
                      <Input
                        name="collabTitle"
                        placeholder="e.g. Seeking 1 Frontend Developer (Next.js) for Hackathon"
                        value={formData.collabTitle}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-foreground">
                        Skills Required
                      </label>
                      <Input
                        name="collabSkills"
                        placeholder="e.g. React, Tailwind CSS, TypeScript"
                        value={formData.collabSkills}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="pt-3 flex items-center justify-end gap-3 border-t border-border/60">
                <Link href="/projects">
                  <Button type="button" variant="ghost" size="sm">
                    Cancel
                  </Button>
                </Link>
                <Button
                  type="submit"
                  size="sm"
                  disabled={isSubmitting}
                  className="font-semibold gap-1.5 shadow-md shadow-primary/20"
                >
                  <Sparkles className="size-4" />
                  {isSubmitting ? "Registering Project..." : "Publish Project"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
