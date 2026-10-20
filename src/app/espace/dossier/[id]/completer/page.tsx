"use client";

import { useParams } from "next/navigation";
import IntakeWizard from "@/components/espace/intake/IntakeWizard";

export default function CompleterPage() {
  const { id } = useParams<{ id: string }>();
  return <IntakeWizard id={id} />;
}
