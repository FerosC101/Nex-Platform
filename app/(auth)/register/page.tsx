"use client";

import * as React from "react";
import Link from "next/link";
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
import { Input } from "@/components/ui/input";
import { sampleSchools } from "@/lib/mock-data";
import { ArrowRight, GraduationCap, School, BookOpen } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = React.useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    school: sampleSchools[0],
    course: "BS Computer Science",
    yearLevel: "3rd Year",
  });
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!formData.firstName || !formData.lastName || !formData.email || !formData.password) {
      setError("Please fill in all required fields.");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setIsLoading(true);
    // Simulate registration & proceed to verification / onboarding flow
    setTimeout(() => {
      setIsLoading(false);
      router.push("/verify-email?email=" + encodeURIComponent(formData.email));
    }, 700);
  };

  return (
    <Card className="border-border/80 bg-card shadow-xl shadow-black/40">
      <CardHeader className="space-y-1.5 text-center">
        <CardTitle className="text-2xl font-bold tracking-tight">
          Join Nex Network
        </CardTitle>
        <CardDescription className="text-muted-foreground text-sm">
          Connect with student developers, builders & hackathons
        </CardDescription>
      </CardHeader>

      <CardContent>
        {error && (
          <div className="mb-4 p-3 rounded-lg bg-destructive/15 border border-destructive/30 text-destructive text-xs font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5">
          {/* Name Row */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-foreground/90 uppercase tracking-wider">
                First Name *
              </label>
              <Input
                name="firstName"
                placeholder="Georgie"
                value={formData.firstName}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-foreground/90 uppercase tracking-wider">
                Last Name *
              </label>
              <Input
                name="lastName"
                placeholder="Villar"
                value={formData.lastName}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* Email */}
          <div className="space-y-1">
            <label className="text-[11px] font-semibold text-foreground/90 uppercase tracking-wider">
              Student / Personal Email *
            </label>
            <Input
              type="email"
              name="email"
              placeholder="student@university.edu.ph"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          {/* Password */}
          <div className="space-y-1">
            <label className="text-[11px] font-semibold text-foreground/90 uppercase tracking-wider">
              Password * (min. 6 chars)
            </label>
            <Input
              type="password"
              name="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          {/* School Selection (Required by Spec) */}
          <div className="space-y-1">
            <label className="text-[11px] font-semibold text-foreground/90 uppercase tracking-wider flex items-center gap-1.5">
              <School className="size-3.5 text-primary" />
              School / University *
            </label>
            <select
              name="school"
              value={formData.school}
              onChange={handleChange}
              className="flex h-10 w-full rounded-lg border border-border bg-card/60 px-3 py-2 text-xs text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:border-primary cursor-pointer"
            >
              {sampleSchools.map((school) => (
                <option key={school} value={school} className="bg-card text-foreground">
                  {school}
                </option>
              ))}
            </select>
          </div>

          {/* Course & Year Level Row */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-foreground/90 uppercase tracking-wider flex items-center gap-1">
                <BookOpen className="size-3 text-primary" />
                Course *
              </label>
              <Input
                name="course"
                placeholder="BS CS / BS IT"
                value={formData.course}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-foreground/90 uppercase tracking-wider flex items-center gap-1">
                <GraduationCap className="size-3 text-primary" />
                Year Level *
              </label>
              <select
                name="yearLevel"
                value={formData.yearLevel}
                onChange={handleChange}
                className="flex h-10 w-full rounded-lg border border-border bg-card/60 px-3 py-2 text-xs text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:border-primary cursor-pointer"
              >
                <option value="1st Year" className="bg-card text-foreground">1st Year</option>
                <option value="2nd Year" className="bg-card text-foreground">2nd Year</option>
                <option value="3rd Year" className="bg-card text-foreground">3rd Year</option>
                <option value="4th Year" className="bg-card text-foreground">4th Year</option>
                <option value="5th Year" className="bg-card text-foreground">5th Year</option>
                <option value="Graduate" className="bg-card text-foreground">Graduate</option>
              </select>
            </div>
          </div>

          <Button
            type="submit"
            className="w-full font-semibold shadow-md shadow-primary/20 mt-2"
            disabled={isLoading}
          >
            {isLoading ? "Creating account..." : "Complete Registration"}
            <ArrowRight className="size-4 ml-1" />
          </Button>
        </form>
      </CardContent>

      <CardFooter className="flex justify-center border-t border-border/60 py-4 text-xs text-muted-foreground">
        <span>Already have an account?</span>
        <Link
          href="/login"
          className="ml-1.5 text-primary hover:underline font-semibold"
        >
          Sign in
        </Link>
      </CardFooter>
    </Card>
  );
}
