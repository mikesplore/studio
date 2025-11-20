"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";

interface BusinessAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {
  mode: "login" | "signup";
}

export function BusinessAuthForm({ className, mode, ...props }: BusinessAuthFormProps) {
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const router = useRouter();

  const title = mode === "login" ? "Business Login" : "Create a Business Account";
  const description =
    mode === "login"
      ? "Enter your credentials to access your business dashboard."
      : "Get started with our suite of AI tools for your brand.";
  const buttonText = mode === "login" ? "Log In" : "Sign Up";
  const linkText =
    mode === "login"
      ? "Not a business partner yet? Sign Up"
      : "Already have an account? Log In";
  const linkHref = mode === "login" ? "/business/signup" : "/business/login";

  async function onSubmit(event: React.SyntheticEvent) {
    event.preventDefault();
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      router.push("/business/dashboard");
    }, 1500);
  }

  return (
    <div className={cn("grid gap-6", className)} {...props}>
      <div className="flex flex-col space-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      <form onSubmit={onSubmit}>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email">Business Email</Label>
            <Input
              id="email"
              placeholder="contact@mybrand.com"
              type="email"
              autoCapitalize="none"
              autoComplete="email"
              autoCorrect="off"
              disabled={isLoading}
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              disabled={isLoading}
              required
            />
          </div>
          <Button disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {buttonText}
          </Button>
        </div>
      </form>
      <p className="px-8 text-center text-sm text-muted-foreground">
        <Link
          href={linkHref}
          className="underline underline-offset-4 hover:text-primary"
        >
          {linkText}
        </Link>
      </p>
    </div>
  );
}
