"use client";

import { useParams } from "next/navigation";
import DossierView from "@/components/espace/DossierView";

export default function DossierPage() {
  const { id } = useParams<{ id: string }>();
  return <DossierView id={id} />;
}
