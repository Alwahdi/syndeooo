import type { Metadata } from "next";
import { ProfessionalOnboardingForm } from "./professional-onboarding-form";

export const metadata: Metadata = {
  title: "Complete Your Profile — SyndeoCare",
  description: "Complete your professional profile to start finding shifts",
};

export default function ProfessionalOnboardingPage() {
  return <ProfessionalOnboardingForm />;
}
