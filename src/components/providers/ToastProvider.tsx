"use client";

import { Toaster } from "react-hot-toast";
import { useEffect, useState } from "react";

export function ToastProvider() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 5000,
        style: {
          background: "#363636",
          color: "#fff",
        },
        success: {
          duration: 3000,
          iconTheme: {
            primary: "#4ade80",
            secondary: "#fff",
          },
        },
        error: {
          duration: 4000,
          iconTheme: {
            primary: "#ef4444",
            secondary: "#fff",
          },
        },
      }}
    />
  );
}
