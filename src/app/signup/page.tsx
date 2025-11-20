import { UserAuthForm } from "@/components/auth/user-auth-form";
import Logo from "@/components/common/logo";

export default function SignupPage() {
  return (
    <div className="container relative min-h-dvh flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-2 lg:px-0">
      <div className="relative hidden h-full flex-col bg-muted p-10 text-white dark:border-r lg:flex">
        <div className="absolute inset-0 bg-primary" />
        <div className="relative z-20 flex items-center text-lg font-medium text-primary-foreground">
          <Logo />
        </div>
        <div className="relative z-20 mt-auto">
          <blockquote className="space-y-2">
            <p className="text-lg text-primary-foreground">
              &ldquo;Style is a way to say who you are without having to speak.&rdquo;
            </p>
            <footer className="text-sm text-primary-foreground/80">Rachel Zoe</footer>
          </blockquote>
        </div>
      </div>
      <div className="lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <UserAuthForm mode="signup" />
        </div>
      </div>
    </div>
  );
}
