"use client";

import * as React from "react";
import Link from "next/link";
import { AppShell } from "@/components/layout/app-shell";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { currentUserProfile } from "@/lib/mock-data";
import { ArrowLeft, Save, Check, Plus, X, User, School, Link as LinkIcon } from "lucide-react";

export default function ProfileSettingsPage() {
  const [formData, setFormData] = React.useState({
    firstName: currentUserProfile.firstName,
    lastName: currentUserProfile.lastName,
    course: currentUserProfile.course,
    yearLevel: currentUserProfile.yearLevel,
    bio: currentUserProfile.bio,
    githubUrl: currentUserProfile.githubUrl || "",
    linkedinUrl: currentUserProfile.linkedinUrl || "",
  });

  const [skills, setSkills] = React.useState<string[]>(currentUserProfile.skills);
  const [newSkillInput, setNewSkillInput] = React.useState("");
  const [savedSuccess, setSavedSuccess] = React.useState(false);
  const [isSaving, setIsSaving] = React.useState(false);

  const handleAddSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSkillInput.trim() || skills.includes(newSkillInput.trim())) return;
    setSkills([...skills, newSkillInput.trim()]);
    setNewSkillInput("");
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setSkills(skills.filter((s) => s !== skillToRemove));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    }, 500);
  };

  return (
    <AppShell>
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Back Link */}
        <Link
          href={`/profile/${currentUserProfile.username}`}
          className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors font-medium"
        >
          <ArrowLeft className="size-3.5" />
          Back to Profile
        </Link>

        <Card className="border-border/80 bg-card shadow-lg">
          <CardHeader className="border-b border-border/60 p-6">
            <CardTitle className="text-xl font-bold text-foreground flex items-center gap-2">
              <User className="size-5 text-primary" />
              Student Profile Settings
            </CardTitle>
            <CardDescription className="text-xs text-muted-foreground">
              Update your student builder portfolio, university details, and technical skills
            </CardDescription>
          </CardHeader>

          <CardContent className="p-6 space-y-6">
            {savedSuccess && (
              <div className="p-3.5 rounded-lg bg-emerald-500/15 border border-emerald-500/20 text-emerald-400 text-xs font-semibold flex items-center gap-2">
                <Check className="size-4" />
                Profile changes successfully saved!
              </div>
            )}

            <form onSubmit={handleSave} className="space-y-5">
              {/* Name Fields */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    First Name
                  </label>
                  <Input
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Last Name
                  </label>
                  <Input
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    required
                  />
                </div>
              </div>

              {/* Bio */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Short Bio
                </label>
                <Textarea
                  rows={3}
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  placeholder="Share your interests, what you build, or hackathon achievements..."
                />
              </div>

              {/* University / Academic Info */}
              <div className="border-t border-border/60 pt-5 space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-foreground flex items-center gap-1.5">
                  <School className="size-3.5 text-primary" />
                  Academic Details
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Course / Degree
                    </label>
                    <Input
                      value={formData.course}
                      onChange={(e) => setFormData({ ...formData, course: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Year Level
                    </label>
                    <select
                      value={formData.yearLevel}
                      onChange={(e) => setFormData({ ...formData, yearLevel: e.target.value })}
                      className="flex h-10 w-full rounded-lg border border-border bg-card/60 px-3 py-2 text-xs text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:border-primary cursor-pointer"
                    >
                      <option value="1st Year">1st Year</option>
                      <option value="2nd Year">2nd Year</option>
                      <option value="3rd Year">3rd Year</option>
                      <option value="4th Year">4th Year</option>
                      <option value="5th Year">5th Year</option>
                      <option value="Graduate">Graduate</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Skills Tag Management */}
              <div className="border-t border-border/60 pt-5 space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-foreground">
                  Skills & Technologies
                </h4>

                <div className="flex flex-wrap gap-1.5">
                  {skills.map((skill) => (
                    <Badge
                      key={skill}
                      variant="secondary"
                      className="gap-1 pl-2.5 pr-1.5 py-1 text-xs"
                    >
                      {skill}
                      <button
                        type="button"
                        onClick={() => handleRemoveSkill(skill)}
                        className="hover:text-destructive transition-colors ml-1 cursor-pointer"
                      >
                        <X className="size-3" />
                      </button>
                    </Badge>
                  ))}
                </div>

                <div className="flex gap-2">
                  <Input
                    placeholder="Add skill (e.g. Next.js, Docker, PyTorch)..."
                    value={newSkillInput}
                    onChange={(e) => setNewSkillInput(e.target.value)}
                    className="text-xs"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleAddSkill}
                    className="shrink-0 gap-1 text-xs"
                  >
                    <Plus className="size-3.5" />
                    Add
                  </Button>
                </div>
              </div>

              {/* Social Links */}
              <div className="border-t border-border/60 pt-5 space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-foreground flex items-center gap-1.5">
                  <LinkIcon className="size-3.5 text-primary" />
                  Social Profiles
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      GitHub Profile URL
                    </label>
                    <Input
                      placeholder="https://github.com/username"
                      value={formData.githubUrl}
                      onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      LinkedIn Profile URL
                    </label>
                    <Input
                      placeholder="https://linkedin.com/in/username"
                      value={formData.linkedinUrl}
                      onChange={(e) => setFormData({ ...formData, linkedinUrl: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              <div className="pt-3 flex justify-end gap-3">
                <Link href={`/profile/${currentUserProfile.username}`}>
                  <Button type="button" variant="ghost" size="sm">
                    Cancel
                  </Button>
                </Link>
                <Button type="submit" size="sm" disabled={isSaving} className="font-semibold gap-1.5 shadow-sm">
                  <Save className="size-3.5" />
                  {isSaving ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
