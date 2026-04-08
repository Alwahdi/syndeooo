"use client";

import { Button } from "@repo/design-system/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/design-system/components/ui/card";
import { Input } from "@repo/design-system/components/ui/input";
import { Label } from "@repo/design-system/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/design-system/components/ui/select";
import { Textarea } from "@repo/design-system/components/ui/textarea";
import { HeartPulseIcon, Loader2Icon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { completeProfessionalOnboarding } from "@/app/actions/onboarding/complete-professional-onboarding";

interface JobRole {
  id: string;
  name: string;
}

export function ProfessionalOnboardingForm() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [jobRoles, setJobRoles] = useState<JobRole[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/job-roles")
      .then((res) => res.json())
      .then((data) => setJobRoles(data))
      .catch(() => undefined);
  }, []);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");

    const formData = new FormData(e.currentTarget);
    const data = {
      phone: formData.get("phone") as string,
      jobRoleId: formData.get("jobRoleId") as string,
      yearsOfExperience: Number(formData.get("yearsOfExperience")),
      bio: formData.get("bio") as string,
      city: formData.get("city") as string,
      licenseNumber: (formData.get("licenseNumber") as string) || undefined,
    };

    startTransition(async () => {
      const result = await completeProfessionalOnboarding(data);
      if (result.error) {
        setError(result.error);
      } else {
        router.push("/");
      }
    });
  }

  return (
    <Card>
      <CardHeader className="text-center">
        <div
          className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl"
          style={{ background: "var(--gradient-brand)" }}
        >
          <HeartPulseIcon className="h-6 w-6 text-white" />
        </div>
        <CardTitle className="text-2xl">Complete Your Profile</CardTitle>
        <CardDescription>
          Tell us about yourself so clinics can find you
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                name="phone"
                placeholder="+966 5XX XXX XXXX"
                required
                type="tel"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <Input id="city" name="city" placeholder="e.g. Riyadh" required />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="jobRoleId">Profession</Label>
              <Select name="jobRoleId" required>
                <SelectTrigger>
                  <SelectValue placeholder="Select your role" />
                </SelectTrigger>
                <SelectContent>
                  {jobRoles.map((role) => (
                    <SelectItem key={role.id} value={role.id}>
                      {role.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="yearsOfExperience">Years of Experience</Label>
              <Input
                id="yearsOfExperience"
                max={50}
                min={0}
                name="yearsOfExperience"
                placeholder="0"
                required
                type="number"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="licenseNumber">License Number (optional)</Label>
            <Input
              id="licenseNumber"
              name="licenseNumber"
              placeholder="Professional license number"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio">About You</Label>
            <Textarea
              id="bio"
              name="bio"
              placeholder="Brief description of your experience and skills"
              required
              rows={3}
            />
          </div>

          {error && <p className="text-destructive text-sm">{error}</p>}

          <Button className="w-full" disabled={isPending} type="submit">
            {isPending ? (
              <>
                <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Complete Profile"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
