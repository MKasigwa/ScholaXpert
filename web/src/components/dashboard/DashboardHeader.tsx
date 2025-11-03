"use client";

import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { GraduationCap } from "lucide-react";
import { ContextSelector } from "../navigation/ContextSelector";
import { UserMenu } from "../navigation/UserMenu";
import { LanguageSwitcher } from "../LanguageSwitcher";
import { ThemeSwitcher } from "../ThemeSwitcher";

interface DashboardHeaderNewProps {
  onCreateTenant?: () => void;
  onCreateYear?: () => void;
}

export function DashboardHeaderNew({
  onCreateTenant,
  onCreateYear,
}: DashboardHeaderNewProps) {
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations("Dashboard");

  const handleCreateTenant = () => {
    if (onCreateTenant) {
      onCreateTenant();
    } else {
      router.push(`/${locale}/auth/workspace/create-tenant`);
    }
  };

  const handleCreateYear = () => {
    if (onCreateYear) {
      onCreateYear();
    } else {
      // Navigate to school year creation page when implemented
      console.log("Navigate to create school year");
    }
  };

  return (
    <header className="h-14 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-40">
      <div className="flex items-center justify-between h-full px-6">
        {/* Left Section */}
        <div className="flex items-center gap-4">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg">
              <GraduationCap className="h-5 w-5 text-white" />
            </div>
            <div className="hidden md:block">
              <h1 className="font-semibold">ScholaXpert</h1>
              <p className="text-xs text-muted-foreground">
                {t("subtitle") || "School Management System"}
              </p>
            </div>
          </div>

          {/* Context Selector */}
          <ContextSelector
            onCreateTenant={handleCreateTenant}
            onCreateYear={handleCreateYear}
          />
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-2">
          {/* Language Switcher */}
          <LanguageSwitcher />

          {/* Theme Switcher */}
          <ThemeSwitcher />

          {/* User Menu */}
          <UserMenu />
        </div>
      </div>
    </header>
  );
}
