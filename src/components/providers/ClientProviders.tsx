 "use client";

import React from "react";
import { UserProvider } from "@/contexts/UserContext";

interface User {
  name: string;
  email: string;
  imageUrl: string;
}

interface ClientProvidersProps {
  children: React.ReactNode;
  user: User;
}

export function ClientProviders({ children, user }: ClientProvidersProps) {
  return <UserProvider initialUser={user}>{children}</UserProvider>;
}