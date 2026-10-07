"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { sampleSkills, sampleInterests } from "@/lib/mock-data";
import { Sparkles, ArrowRight, Check } from "lucide-react";

export default function OnboardingPage() {
  const router = useRouter();
  const [selectedSkills, setSelectedSkills] = React.useState<string[]>([
    "React",
    "TypeScript",
    "Tailwind CSS",
  ]);
  const [selectedInterests, setSelectedInterests] = React.useState<string[]>([
    "Hackathons",
    "AI & Machine Learning",
  ]);
  const [bio, setBio] = React.useState(
    "CS student eager to collaborate on hackathons and full-stack projects."
  );
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const toggleSkill = (skill: string) => {
    setSelectedSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
    );
  };

  const toggleInterest = (interest: string) => {
    setSelectedInterests((prev) =>
      prev.includes(interest)
        ? prev.filter((i) => i !== interest)
        : [...prev, interest]
    );
  };

  const handleFinish = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      router.push("/dashboard");
    }, 600);
  };

  return (
    <Card className="border-border/80 bg-card shadow-xl shadow-black/40">
      <CardHeader className="text-center space-y-1.5">
        <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary mx-auto mb-2">
          <Sparkles className="size-6" />
        </div>
        <CardTitle className="text-2xl font-bold tracking-tight">
          Personalize Your Nex Experience
        </CardTitle>
        <CardDescription className="text-muted-foreground text-sm">
          Select your tech skills and community interests to discover matching peers
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-5">
        {/* Skills Section */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-foreground/90 uppercase tracking-wider flex items-center justify-between">
            <span>Primary Technical Skills</span>
            <span className="text-primary font-mono text-[11px]">
              {selectedSkills.length} selected
            </span>
          </label>
          <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto p-1 border border-border/60 rounded-lg bg-card/40">
            {sampleSkills.map((skill) => {
              const isSelected = selectedSkills.includes(skill);
              return (
                <button
                  type="button"
                  key={skill}
                  onClick={() => toggleSkill(skill)}
                  className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer border ${
                    isSelected
                      ? "bg-primary text-primary-foreground border-primary font-semibold shadow-xs"
                      : "bg-secondary text-muted-foreground border-border hover:text-foreground hover:bg-muted/60"
                  }`}
                >
                  {isSelected && <Check className="size-3" />}
                  {skill}
                </button>
              );
            })}
          </div>
        </div>

        {/* Interests Section */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-foreground/90 uppercase tracking-wider flex items-center justify-between">
            <span>Community Interests</span>
            <span className="text-primary font-mono text-[11px]">
              {selectedInterests.length} selected
            </span>
          </label>
          <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto p-1 border border-border/60 rounded-lg bg-card/40">
            {sampleInterests.map((interest) => {
              const isSelected = selectedInterests.includes(interest);
              return (
                <button
                  type="button"
                  key={interest}
                  onClick={() => toggleInterest(interest)}
                  className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer border ${
                    isSelected
                      ? "bg-primary text-primary-foreground border-primary font-semibold shadow-xs"
                      : "bg-secondary text-muted-foreground border-border hover:text-foreground hover:bg-muted/60"
                  }`}
                >
                  {isSelected && <Check className="size-3" />}
                  {interest}
                </button>
              );
            })}
          </div>
        </div>

        {/* Bio Section */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-foreground/90 uppercase tracking-wider">
            Short Student Bio
          </label>
          <Textarea
            rows={2}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Tell fellow students what you love building..."
          />
        </div>
      </CardContent>

      <CardFooter className="flex flex-col gap-2 border-t border-border/60 py-4">
        <Button
          onClick={handleFinish}
          disabled={isSubmitting}
          className="w-full font-semibold shadow-md shadow-primary/20"
        >
          {isSubmitting ? "Finalizing profile..." : "Finish Setup & Enter Dashboard"}
          <ArrowRight className="size-4 ml-1" />
        </Button>
      </CardFooter>
    </Card>
  );
}
