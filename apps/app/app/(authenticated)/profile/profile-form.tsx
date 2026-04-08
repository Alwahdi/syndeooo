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
import { Loader2Icon, SaveIcon } from "lucide-react";
import { useState, useTransition } from "react";
import { completeClinicOnboarding } from "@/app/actions/onboarding/complete-clinic-onboarding";
import { completeProfessionalOnboarding } from "@/app/actions/onboarding/complete-professional-onboarding";

interface User {
  email: string;
  id: string;
  image: string | null;
  name: string | null;
}

interface Profile {
  bio: string | null;
  city: string | null;
  jobRole: { name: string } | null;
  jobRoleId: string | null;
  licenseNumber: string | null;
  phone: string | null;
  yearsOfExperience: number | null;
}

interface Clinic {
  address: string | null;
  city: string | null;
  description: string | null;
  licenseNumber: string | null;
  name: string;
  phone: string | null;
  specialties: string[];
}

interface JobRole {
  id: string;
  name: string;
}

interface ProfileFormProps {
  clinic: Clinic | null;
  isClinic: boolean;
  jobRoles: JobRole[];
  profile: Profile | null;
  user: User;
}

function handleResult(
  result: { error?: string },
  setError: (e: string) => void,
  setSaved: (s: boolean) => void
) {
  if (result.error) {
    setError(result.error);
  } else {
    setSaved(true);
  }
}

function submitClinicForm(formData: FormData) {
  const specialtiesRaw = formData.get("specialties") as string;
  return completeClinicOnboarding({
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
  });
}

function submitProfessionalForm(formData: FormData) {
  return completeProfessionalOnboarding({
    phone: formData.get("phone") as string,
    jobRoleId: formData.get("jobRoleId") as string,
    yearsOfExperience: Number(formData.get("yearsOfExperience")),
    bio: formData.get("bio") as string,
    city: formData.get("city") as string,
    licenseNumber: (formData.get("licenseNumber") as string) || undefined,
  });
}

function FormActions({
  error,
  isPending,
  saved,
}: {
  error: string;
  isPending: boolean;
  saved: boolean;
}) {
  return (
    <>
      {error && <p className="text-destructive text-sm">{error}</p>}
      {saved && <p className="text-green-600 text-sm">Profile saved!</p>}
      <Button disabled={isPending} type="submit">
        {isPending ? (
          <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <SaveIcon className="mr-2 h-4 w-4" />
        )}
        Save Changes
      </Button>
    </>
  );
}

export function ProfileForm({
  user: _user,
  profile,
  clinic,
  jobRoles,
  isClinic,
}: ProfileFormProps) {
  const [isPending, startTransition] = useTransition();
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setSaved(false);

    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      const result = isClinic
        ? await submitClinicForm(formData)
        : await submitProfessionalForm(formData);
      handleResult(result, setError, setSaved);
    });
  }

  if (isClinic) {
    return (
      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Clinic Profile</CardTitle>
          <CardDescription>
            Manage your clinic&apos;s information
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <Label htmlFor="clinicName">Clinic Name</Label>
              <Input
                defaultValue={clinic?.name ?? ""}
                id="clinicName"
                name="clinicName"
                required
              />
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  defaultValue={clinic?.phone ?? ""}
                  id="phone"
                  name="phone"
                  required
                  type="tel"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input
                  defaultValue={clinic?.city ?? ""}
                  id="city"
                  name="city"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Input
                defaultValue={clinic?.address ?? ""}
                id="address"
                name="address"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="specialties">Specialties</Label>
              <Input
                defaultValue={clinic?.specialties?.join(", ") ?? ""}
                id="specialties"
                name="specialties"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="licenseNumber">License Number</Label>
              <Input
                defaultValue={clinic?.licenseNumber ?? ""}
                id="licenseNumber"
                name="licenseNumber"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                defaultValue={clinic?.description ?? ""}
                id="description"
                name="description"
                required
                rows={3}
              />
            </div>
            <FormActions error={error} isPending={isPending} saved={saved} />
          </form>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="max-w-2xl">
      <CardHeader>
        <CardTitle>Professional Profile</CardTitle>
        <CardDescription>
          Keep your profile up to date to get the best shift matches
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                defaultValue={profile?.phone ?? ""}
                id="phone"
                name="phone"
                required
                type="tel"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <Input
                defaultValue={profile?.city ?? ""}
                id="city"
                name="city"
                required
              />
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="jobRoleId">Profession</Label>
              <Select
                defaultValue={profile?.jobRoleId ?? undefined}
                name="jobRoleId"
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select role" />
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
                defaultValue={Math.max(0, Math.min(50, profile?.yearsOfExperience ?? 0))}
                id="yearsOfExperience"
                max="50"
                min="0"
                name="yearsOfExperience"
                required
                step="1"
                type="number"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="licenseNumber">License Number</Label>
            <Input
              defaultValue={profile?.licenseNumber ?? ""}
              id="licenseNumber"
              name="licenseNumber"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="bio">About You</Label>
            <Textarea
              defaultValue={profile?.bio ?? ""}
              id="bio"
              name="bio"
              required
              rows={3}
            />
          </div>
          <FormActions error={error} isPending={isPending} saved={saved} />
        </form>
      </CardContent>
    </Card>
  );
}