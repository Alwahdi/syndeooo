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
import { Textarea } from "@repo/design-system/components/ui/textarea";
import { BuildingIcon, Loader2Icon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { completeClinicOnboarding } from "@/app/actions/onboarding/complete-clinic-onboarding";

export function ClinicOnboardingForm() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");

    const formData = new FormData(e.currentTarget);
    const specialtiesRaw = formData.get("specialties") as string;
    const data = {
      clinicName: formData.get("clinicName") as string,
      phone: formData.get("phone") as string,
      address: formData.get("address") as string,
      city: formData.get("city") as string,
      description: formData.get("description") as string,
      specialties: specialtiesRaw
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      licenseNumber: (formData.get("licenseNumber") as string) || undefined,
    };

    startTransition(async () => {
      const result = await completeClinicOnboarding(data);
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
          <BuildingIcon className="h-6 w-6 text-white" />
        </div>
        <CardTitle className="text-2xl">Set Up Your Clinic</CardTitle>
        <CardDescription>
          Tell us about your clinic so professionals can find you
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <Label htmlFor="clinicName">Clinic Name</Label>
            <Input
              id="clinicName"
              name="clinicName"
              placeholder="e.g. Al-Salam Medical Center"
              required
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                name="phone"
                placeholder="+966 XX XXX XXXX"
                required
                type="tel"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <Input id="city" name="city" placeholder="e.g. Riyadh" required />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Input
              id="address"
              name="address"
              placeholder="Full clinic address"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="specialties">Specialties</Label>
            <Input
              id="specialties"
              name="specialties"
              placeholder="e.g. Dental, Orthopedics, General Practice"
            />
            <p className="text-muted-foreground text-xs">
              Separate multiple specialties with commas
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="licenseNumber">License Number (optional)</Label>
            <Input
              id="licenseNumber"
              name="licenseNumber"
              placeholder="Clinic license number"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              placeholder="Brief description of your clinic"
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
              "Complete Setup"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
