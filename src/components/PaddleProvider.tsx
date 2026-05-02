"use client";

import { useEffect } from "react";
import { initializePaddle } from "@paddle/paddle-js";

export default function PaddleProvider() {
  useEffect(() => {
    initializePaddle({
      token: process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN!,
      environment: "production",
    });
  }, []);

  return null;
}
