import type { Metadata } from "next";
import { ClinicOnboardingForm } from "./clinic-onboarding-form";

export const metadata: Metadata = {
  title: "Set Up Your Clinic — SyndeoCare",
  description: "Complete your clinic profile to start posting shifts",
};

export default function ClinicOnboardingPage() {
  return <ClinicOnboardingForm />;
}
