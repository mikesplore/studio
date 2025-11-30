"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  User,
  Mail,
  Image as ImageIcon,
  Coins,
  TrendingUp,
  Clock,
  Cpu,
} from "lucide-react";

// USD to KSH exchange rate
const USD_TO_KSH_RATE = 129;

type UsageRecord = {
  inputTokens: number;
  outputTokens: number;
  inputCostUsd: number;
  outputCostUsd: number;
  totalCostUsd: number;
  totalCostKsh: number;
  createdAt: string;
};

type UsageStats = {
  email: string;
  totalGenerations: number;
  totalInputTokens: number;
  totalOutputTokens: number;
  totalCostUsd: number;
  totalCostKsh: number;
  lastGenerationDate: string | null;
};

type UsageData = {
  stats: UsageStats;
  history: UsageRecord[];
};

function formatKsh(amount: number): string {
  return new Intl.NumberFormat("en-KE", {
    style: "currency",
    currency: "KES",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

function formatUsd(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 4,
    maximumFractionDigits: 4,
  }).format(amount);
}

function formatNumber(num: number): string {
  return new Intl.NumberFormat("en-US").format(num);
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-KE", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function StatCard({
  title,
  value,
  subValue,
  icon: Icon,
  variant = "default",
}: {
  title: string;
  value: string;
  subValue?: string;
  icon: React.ElementType;
  variant?: "default" | "primary" | "success" | "warning";
}) {
  const variantClasses = {
    default: "bg-card",
    primary: "bg-primary/10 border-primary/20",
    success: "bg-green-500/10 border-green-500/20",
    warning: "bg-amber-500/10 border-amber-500/20",
  };

  const iconClasses = {
    default: "text-muted-foreground",
    primary: "text-primary",
    success: "text-green-500",
    warning: "text-amber-500",
  };

  return (
    <Card className={`${variantClasses[variant]}`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className={`h-4 w-4 ${iconClasses[variant]}`} />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {subValue && (
          <p className="text-xs text-muted-foreground">{subValue}</p>
        )}
      </CardContent>
    </Card>
  );
}

function StatCardSkeleton() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-4" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-8 w-32 mb-1" />
        <Skeleton className="h-3 w-20" />
      </CardContent>
    </Card>
  );
}

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const [usageData, setUsageData] = useState<UsageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchUsageData() {
      if (session?.user?.email) {
        try {
          const response = await fetch("/api/user/usage");
          if (!response.ok) {
            throw new Error("Failed to fetch usage data");
          }
          const data = await response.json();
          setUsageData(data);
        } catch (err) {
          setError(err instanceof Error ? err.message : "Failed to load usage data");
        } finally {
          setLoading(false);
        }
      }
    }

    if (status !== "loading") {
      fetchUsageData();
    }
  }, [session, status]);

  if (status === "loading") {
    return (
      <div className="space-y-8">
        <div className="flex items-center gap-4">
          <Skeleton className="h-20 w-20 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-64" />
          </div>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <Card className="p-8 text-center">
        <CardTitle>Not Signed In</CardTitle>
        <CardDescription className="mt-2">
          Please sign in to view your profile and usage statistics.
        </CardDescription>
      </Card>
    );
  }

  const stats = usageData?.stats;
  const history = usageData?.history || [];

  return (
    <div className="space-y-8">
      {/* Profile Header */}
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
        <Avatar className="h-24 w-24">
          <AvatarImage
            src={session.user?.image || undefined}
            alt={session.user?.name || "User"}
            referrerPolicy="no-referrer"
          />
          <AvatarFallback className="bg-primary text-white text-2xl">
            {session.user?.name?.charAt(0).toUpperCase() || "U"}
          </AvatarFallback>
        </Avatar>
        <div className="text-center sm:text-left space-y-2">
          <h1 className="text-3xl font-bold">{session.user?.name}</h1>
          <div className="flex items-center justify-center sm:justify-start gap-2 text-muted-foreground">
            <Mail className="h-4 w-4" />
            <span>{session.user?.email}</span>
          </div>
          <Badge variant="secondary" className="mt-2">
            <User className="h-3 w-3 mr-1" />
            Personal Account
          </Badge>
        </div>
      </div>

      <Separator />

      {/* Usage Statistics */}
      <div>
        <h2 className="text-2xl font-semibold mb-4">AI Usage Statistics</h2>
        <p className="text-muted-foreground mb-6">
          Track your virtual try-on image generation usage and costs.
        </p>

        {loading ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <StatCardSkeleton key={i} />
            ))}
          </div>
        ) : error ? (
          <Card className="p-6 text-center text-red-500">
            <p>{error}</p>
          </Card>
        ) : (
          <>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <StatCard
                title="Total Generations"
                value={formatNumber(stats?.totalGenerations || 0)}
                subValue="Images created"
                icon={ImageIcon}
                variant="primary"
              />
              <StatCard
                title="Total Cost (KSH)"
                value={formatKsh(stats?.totalCostKsh || 0)}
                subValue={formatUsd(stats?.totalCostUsd || 0)}
                icon={Coins}
                variant="warning"
              />
              <StatCard
                title="Input Tokens"
                value={formatNumber(stats?.totalInputTokens || 0)}
                subValue="For prompts & images"
                icon={Cpu}
              />
              <StatCard
                title="Output Tokens"
                value={formatNumber(stats?.totalOutputTokens || 0)}
                subValue="Generated content"
                icon={TrendingUp}
              />
            </div>

            {/* Pricing Information */}
            <Card className="mt-6 bg-muted/30">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <span>💰</span> Pricing Information
                </CardTitle>
                <CardDescription>
                  Gemini 2.5 Flash Image model pricing (paid tier)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-4 text-sm">
                  <div className="p-3 rounded-lg bg-background">
                    <p className="font-medium">Input Price</p>
                    <p className="text-muted-foreground">$0.30 / 1M tokens</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      ~KSH {(0.30 * USD_TO_KSH_RATE).toFixed(2)} / 1M tokens
                    </p>
                  </div>
                  <div className="p-3 rounded-lg bg-background">
                    <p className="font-medium">Output Price</p>
                    <p className="text-muted-foreground">$0.039 / image</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      ~KSH {(0.039 * USD_TO_KSH_RATE).toFixed(2)} / image
                    </p>
                  </div>
                  <div className="p-3 rounded-lg bg-background">
                    <p className="font-medium">Output Tokens</p>
                    <p className="text-muted-foreground">1,290 tokens / image</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Up to 1024x1024px
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Usage History */}
            {history.length > 0 && (
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    Recent Usage History
                  </CardTitle>
                  <CardDescription>
                    Your last {history.length} image generations
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead className="text-right">Input Tokens</TableHead>
                        <TableHead className="text-right">Output Tokens</TableHead>
                        <TableHead className="text-right">Cost (KSH)</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {history.map((record, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium">
                            {formatDate(record.createdAt)}
                          </TableCell>
                          <TableCell className="text-right">
                            {formatNumber(record.inputTokens)}
                          </TableCell>
                          <TableCell className="text-right">
                            {formatNumber(record.outputTokens)}
                          </TableCell>
                          <TableCell className="text-right font-semibold">
                            {formatKsh(record.totalCostKsh)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            )}

            {history.length === 0 && (
              <Card className="mt-6 p-8 text-center">
                <ImageIcon className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <CardTitle className="text-lg">No Usage Yet</CardTitle>
                <CardDescription className="mt-2">
                  Start generating virtual try-on images to see your usage statistics here.
                </CardDescription>
              </Card>
            )}
          </>
        )}
      </div>
    </div>
  );
}
