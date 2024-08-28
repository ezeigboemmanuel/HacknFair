"use client";

import { ClerkProvider, SignInButton, useAuth } from "@clerk/nextjs";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import {
  Authenticated,
  AuthLoading,
  ConvexProvider,
  ConvexReactClient,
  Unauthenticated,
} from "convex/react";
import Navbar from "@/components/unathenticated/Navbar";
import Home from "@/components/unathenticated/Home";

interface ConvexClientProviderProps {
  children: React.ReactNode;
}

const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL!;

const convex = new ConvexReactClient(convexUrl);

export function ConvexClientProvider({ children }: ConvexClientProviderProps) {
  return (
    <ClerkProvider>
      <ConvexProviderWithClerk useAuth={useAuth} client={convex}>
        <Unauthenticated>
          <div className="relative">
            <Navbar />
            <Home />
          </div>
        </Unauthenticated>
        <Authenticated>{children}</Authenticated>
      </ConvexProviderWithClerk>
    </ClerkProvider>
  );
}
