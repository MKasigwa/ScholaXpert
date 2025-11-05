"use client";

import React, { ReactNode } from "react";
import { useTranslations } from "next-intl";
import { useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  UserCheck,
  Calendar,
  GraduationCap,
  Menu,
} from "lucide-react";
import { Button } from "./ui/button";
import { ContextSelector } from "./navigation/ContextSelector";
import { UserMenu } from "./navigation/UserMenu";
import { cn } from "@/lib/utils";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { ThemeSwitcher } from "./ThemeSwitcher";

interface LayoutProps {
  children: ReactNode;
  locale: string;
}

export function Layout({ children, locale }: LayoutProps) {
  const t = useTranslations("Layout");
  const { data: session } = useSession();
  const pathname = usePathname();
  const router = useRouter();

  const [sidebarOpen, setSidebarOpen] = React.useState(true);

  // Check if user is admin or super_admin
  const isAdmin = React.useMemo(() => {
    const userRole = session?.user?.role?.toLowerCase();
    return userRole === "admin" || userRole === "super_admin";
  }, [session?.user?.role]);

  // Navigation items
  const navigationItems = React.useMemo(() => {
    const items = [
      {
        id: "dashboard",
        label: t("nav.dashboard"),
        href: `/${locale}/dashboard`,
        icon: LayoutDashboard,
        requiresAdmin: false,
      },
    ];

    // Add admin-only items
    if (isAdmin) {
      items.push(
        {
          id: "tenant-access-requests",
          label: t("nav.tenantAccessRequests"),
          href: `/${locale}/admin/tenant-access-requests`,
          icon: UserCheck,
          requiresAdmin: true,
        },
        {
          id: "school-year-management",
          label: t("nav.schoolYearManagement"),
          href: `/${locale}/admin/school-years`,
          icon: Calendar,
          requiresAdmin: true,
        }
      );
    }

    return items;
  }, [isAdmin, locale, t]);

  const handleNavigation = (href: string) => {
    router.push(href);
  };

  const isActiveRoute = (href: string) => {
    return pathname === href;
  };

  return (
    <div className="flex h-screen w-full overflow-hidden">
      {/* Sidebar */}
      <aside
        className={cn(
          "border-r bg-background transition-all duration-300 flex flex-col",
          sidebarOpen ? "w-64" : "w-16"
        )}
      >
        {/* Sidebar Header */}
        <div className="h-14 border-b flex items-center justify-between px-4">
          {sidebarOpen && (
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-primary rounded-lg bg-gradient-to-br from-blue-600 to-purple-600">
                <GraduationCap className="h-5 w-5 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="font-semibold text-sm">ScholaXpert</span>
                {/* <span className="text-xs text-muted-foreground">
                  {t("tagline")}
                </span> */}
              </div>
            </div>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className={cn("h-8 w-8", !sidebarOpen && "mx-auto")}
          >
            <Menu className="h-4 w-4" />
          </Button>
        </div>

        {/* Sidebar Navigation */}
        <nav className="flex-1 overflow-y-auto py-4">
          <div className="space-y-1 px-2">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = isActiveRoute(item.href);

              return (
                <button
                  key={item.id}
                  onClick={() => handleNavigation(item.href)}
                  className={cn(
                    "w-full flex items-center gap-3 rounded-lg px-3 py-2.5 transition-colors",
                    "hover:bg-accent hover:text-accent-foreground",
                    isActive && "bg-accent text-accent-foreground font-medium",
                    !sidebarOpen && "justify-center"
                  )}
                  title={!sidebarOpen ? item.label : undefined}
                >
                  <Icon className="h-5 w-5 shrink-0" />
                  {sidebarOpen && <span className="text-sm">{item.label}</span>}
                </button>
              );
            })}
          </div>
        </nav>

        {/* Sidebar Footer - Admin Badge */}
        {isAdmin && sidebarOpen && (
          <div className="border-t p-4">
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-primary/10 text-primary">
              <UserCheck className="h-4 w-4" />
              <span className="text-xs font-medium">{t("adminAccess")}</span>
            </div>
          </div>
        )}
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-14 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="flex items-center justify-between h-full px-6">
            {/* Left Section - Context Selector */}
            <div className="flex items-center gap-4">
              <ContextSelector />
            </div>

            {/* Right Section - User Menu */}
            {/* <UserMenu /> */}
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

        {/* Main Content */}
        <main className="flex-1 overflow-auto bg-muted/30">
          <div className="container mx-auto p-6 max-w-7xl">{children}</div>
        </main>
      </div>
    </div>
  );
}
