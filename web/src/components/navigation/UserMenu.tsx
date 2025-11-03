"use client";

import { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useTranslations, useLocale } from "next-intl";
import { User, Settings, LogOut, Bell, HelpCircle } from "lucide-react";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Separator } from "../ui/separator";
import { Badge } from "../ui/badge";

interface UserMenuProps {
  onProfileClick?: () => void;
  onSettingsClick?: () => void;
  onLogoutClick?: () => void;
}

export function UserMenu({
  onProfileClick,
  onSettingsClick,
  onLogoutClick,
}: UserMenuProps) {
  const [open, setOpen] = useState(false);
  const { data: session } = useSession();
  const router = useRouter();
  const t = useTranslations("Dashboard");
  const locale = useLocale();

  if (!session?.user) return null;

  const user = session.user;

  const getRoleDisplayName = (role?: string) => {
    if (!role) return "User";
    switch (role) {
      case "super_admin":
        return t("roles.super_admin") || "Super Administrator";
      case "school_admin":
        return t("roles.school_admin") || "School Administrator";
      case "registrar":
        return t("roles.registrar") || "Registrar";
      case "teacher":
        return t("roles.teacher") || "Teacher";
      case "staff":
        return t("roles.staff") || "Staff";
      default:
        return role;
    }
  };

  const getInitials = () => {
    const firstName = user.firstName || "";
    const lastName = user.lastName || "";
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase() || "U";
  };

  const menuItems = [
    {
      icon: User,
      label: t("userMenu.profile") || "Profile Settings",
      onClick: () => {
        if (onProfileClick) {
          onProfileClick();
        } else {
          router.push(`/${locale}/dashboard/profile`);
        }
        setOpen(false);
      },
    },
    {
      icon: Settings,
      label: t("userMenu.settings") || "Account Settings",
      onClick: () => {
        if (onSettingsClick) {
          onSettingsClick();
        } else {
          router.push(`/${locale}/dashboard/settings`);
        }
        setOpen(false);
      },
    },
    {
      icon: HelpCircle,
      label: t("userMenu.help") || "Help & Support",
      onClick: () => setOpen(false),
    },
  ];

  const handleLogout = async () => {
    if (onLogoutClick) {
      onLogoutClick();
    } else {
      await signOut({ redirect: true, callbackUrl: `/${locale}/auth/sign-in` });
    }
    setOpen(false);
  };

  return (
    <div className="flex items-center gap-2">
      {/* Notifications */}
      <Button variant="ghost" size="sm" className="h-8 w-8 p-0 relative">
        <Bell className="h-4 w-4" />
        <Badge
          variant="destructive"
          className="absolute -top-1 -right-1 h-4 w-4 p-0 text-xs flex items-center justify-center"
        >
          3
        </Badge>
      </Button>

      {/* User Menu */}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="ghost" className="h-8 px-2 gap-2">
            <Avatar className="h-6 w-6">
              <AvatarFallback className="text-xs bg-gradient-to-br from-blue-600 to-purple-600 text-white">
                {getInitials()}
              </AvatarFallback>
            </Avatar>
            <span className="text-sm font-medium hidden md:inline">
              {user.firstName}
            </span>
          </Button>
        </PopoverTrigger>

        <PopoverContent className="w-64 p-0" align="end">
          <div className="p-4">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarFallback className="bg-gradient-to-br from-blue-600 to-purple-600 text-white">
                  {getInitials()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm truncate">
                  {user.firstName} {user.lastName}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {user.email}
                </p>
                <Badge variant="secondary" className="text-xs mt-1">
                  {getRoleDisplayName(user.role)}
                </Badge>
              </div>
            </div>
          </div>

          <Separator />

          <div className="p-2">
            {menuItems.map((item, index) => {
              const Icon = item.icon;
              return (
                <Button
                  key={index}
                  variant="ghost"
                  className="w-full justify-start h-9 px-3"
                  onClick={item.onClick}
                >
                  <Icon className="h-4 w-4 mr-3" />
                  {item.label}
                </Button>
              );
            })}
          </div>

          <Separator />

          <div className="p-2">
            <Button
              variant="ghost"
              className="w-full justify-start h-9 px-3 text-destructive hover:text-destructive"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4 mr-3" />
              {t("userMenu.logout") || "Sign Out"}
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
