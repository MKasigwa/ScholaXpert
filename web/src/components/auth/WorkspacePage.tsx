"use client";

import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useSession } from "next-auth/react";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Badge } from "../ui/badge";
import { LanguageSwitcher } from "../LanguageSwitcher";
import { ThemeSwitcher } from "../ThemeSwitcher";
import {
  Building2,
  UserPlus,
  GraduationCap,
  ArrowRight,
  CheckCircle2,
  Users,
  Shield,
  Sparkles,
  Loader2,
} from "lucide-react";

export function WorkspacePage() {
  const router = useRouter();
  const t = useTranslations("Workspace");
  const { data: session, status } = useSession();
  const [selectedOption, setSelectedOption] = useState<
    "create" | "join" | null
  >(null);

  // Show loading state while checking authentication
  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">
            {t("loading") || "Loading..."}
          </p>
        </div>
      </div>
    );
  }

  // Don't render the page if user is being redirected
  if (
    status === "unauthenticated" ||
    (status === "authenticated" && session?.user?.tenantId)
  ) {
    return null;
  }

  const handleCreateTenant = () => {
    router.push("/auth/workspace/create-tenant");
  };

  const handleRequestAccess = () => {
    router.push("/auth/workspace/request-access");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4">
      {/* Language & Theme Switchers - Top Right */}
      <div className="fixed top-4 right-4 z-50 flex items-center gap-2">
        <LanguageSwitcher />
        <ThemeSwitcher />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-5xl"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl mb-4"
          >
            <GraduationCap className="h-8 w-8 text-white" />
          </motion.div>
          <h1 className="text-3xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            {t("appName")}
          </h1>
          <p className="text-muted-foreground">{t("tagline")}</p>
        </div>

        {/* Main Content */}
        <div className="space-y-6">
          {/* Welcome Message */}
          <Card className="text-center border-2 border-primary/20">
            <CardContent className="pt-6">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-full mb-4">
                <CheckCircle2 className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <h2 className="text-2xl mb-2">{t("welcome.title")}</h2>
              <p className="text-muted-foreground">{t("welcome.subtitle")}</p>
            </CardContent>
          </Card>

          {/* Options */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Create New Tenant */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card
                className={`cursor-pointer transition-all duration-300 hover:shadow-xl hover:scale-105 ${
                  selectedOption === "create"
                    ? "border-2 border-blue-500 shadow-lg"
                    : "border-2 border-transparent"
                }`}
                onClick={() => setSelectedOption("create")}
              >
                <CardHeader>
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                      <Building2 className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                    </div>
                    <Badge
                      variant="secondary"
                      className="bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300"
                    >
                      {t("createTenant.badge")}
                    </Badge>
                  </div>
                  <CardTitle className="text-xl">
                    {t("createTenant.title")}
                  </CardTitle>
                  <CardDescription className="text-base">
                    {t("createTenant.description")}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                      <span>{t("createTenant.features.feature1")}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                      <span>{t("createTenant.features.feature2")}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                      <span>{t("createTenant.features.feature3")}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                      <span>{t("createTenant.features.feature4")}</span>
                    </div>
                  </div>
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCreateTenant();
                    }}
                    className="w-full"
                    size="lg"
                  >
                    {t("createTenant.button")}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            </motion.div>

            {/* Request Access to Existing Tenant */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card
                className={`cursor-pointer transition-all duration-300 hover:shadow-xl hover:scale-105 ${
                  selectedOption === "join"
                    ? "border-2 border-purple-500 shadow-lg"
                    : "border-2 border-transparent"
                }`}
                onClick={() => setSelectedOption("join")}
              >
                <CardHeader>
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
                      <UserPlus className="h-8 w-8 text-purple-600 dark:text-purple-400" />
                    </div>
                    <Badge
                      variant="secondary"
                      className="bg-purple-100 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300"
                    >
                      {t("joinTenant.badge")}
                    </Badge>
                  </div>
                  <CardTitle className="text-xl">
                    {t("joinTenant.title")}
                  </CardTitle>
                  <CardDescription className="text-base">
                    {t("joinTenant.description")}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                      <span>{t("joinTenant.features.feature1")}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                      <span>{t("joinTenant.features.feature2")}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                      <span>{t("joinTenant.features.feature3")}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                      <span>{t("joinTenant.features.feature4")}</span>
                    </div>
                  </div>
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRequestAccess();
                    }}
                    variant="outline"
                    className="w-full border-2"
                    size="lg"
                  >
                    {t("joinTenant.button")}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Additional Info */}
          <div className="grid md:grid-cols-3 gap-4 mt-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Card className="text-center">
                <CardContent className="pt-6">
                  <div className="inline-flex items-center justify-center w-10 h-10 bg-blue-100 dark:bg-blue-900/20 rounded-full mb-3">
                    <Users className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="mb-1">{t("info.multiUser.title")}</h3>
                  <p className="text-sm text-muted-foreground">
                    {t("info.multiUser.description")}
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <Card className="text-center">
                <CardContent className="pt-6">
                  <div className="inline-flex items-center justify-center w-10 h-10 bg-green-100 dark:bg-green-900/20 rounded-full mb-3">
                    <Shield className="h-5 w-5 text-green-600 dark:text-green-400" />
                  </div>
                  <h3 className="mb-1">{t("info.secure.title")}</h3>
                  <p className="text-sm text-muted-foreground">
                    {t("info.secure.description")}
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              <Card className="text-center">
                <CardContent className="pt-6">
                  <div className="inline-flex items-center justify-center w-10 h-10 bg-purple-100 dark:bg-purple-900/20 rounded-full mb-3">
                    <Sparkles className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <h3 className="mb-1">{t("info.flexible.title")}</h3>
                  <p className="text-sm text-muted-foreground">
                    {t("info.flexible.description")}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-muted-foreground mt-8">
          {t("footer")}
        </p>
      </motion.div>
    </div>
  );
}
