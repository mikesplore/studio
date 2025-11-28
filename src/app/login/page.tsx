
import { UserAuthForm } from "@/components/auth/user-auth-form";
import Logo from "@/components/common/logo";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";

function AuthFormSkeleton() {
  return (
    <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
      <div className="flex flex-col space-y-2 text-center">
        <Skeleton className="h-9 w-48 mx-auto" />
        <Skeleton className="h-5 w-64 mx-auto" />
      </div>
      <div className="grid gap-4">
        <Skeleton className="h-12 w-full" />
      </div>
      <Skeleton className="h-4 w-full" />
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="container relative min-h-dvh flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-2 lg:px-0">
      <Link href="/" className="absolute left-4 top-4 md:left-8 md:top-8">
        <Button variant="ghost" size="sm">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
      </Link>
      <div className="relative hidden h-full flex-col bg-gradient-to-br from-primary via-primary/90 to-accent p-10 text-white dark:border-r lg:flex">
        <div className="relative z-20 flex items-center text-lg font-medium text-primary-foreground">
          <Logo />
        </div>
        <div className="relative z-20 mt-auto">
          <blockquote className="space-y-4">
            <p className="text-2xl font-semibold text-primary-foreground">
              &ldquo;Fashion is the armor to survive the reality of everyday life.&rdquo;
            </p>
            <footer className="text-sm text-primary-foreground/80">Bill Cunningham</footer>
          </blockquote>
        </div>
      </div>
      <div className="lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <Suspense fallback={<AuthFormSkeleton />}>
            <UserAuthForm mode="login" />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
