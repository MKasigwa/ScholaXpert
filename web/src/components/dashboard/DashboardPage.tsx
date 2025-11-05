"use client";

import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import { DashboardHeaderNew } from "./DashboardHeader";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import {
  Users,
  GraduationCap,
  BookOpen,
  Calendar,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Bell,
  BarChart3,
  UserCheck,
  FileText,
  CreditCard,
  Bus,
  Briefcase,
  ClipboardCheck,
  BookMarked,
  ArrowRight,
  Activity,
  AlertCircle,
} from "lucide-react";
import { motion } from "motion/react";

// Stats card component
function StatCard({
  title,
  value,
  description,
  icon: Icon,
  trend,
  trendDirection = "up",
  index,
}: {
  title: string;
  value: string;
  description: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  icon: any;
  trend?: string;
  trendDirection?: "up" | "down";
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
    >
      <Card className="hover:shadow-md transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm">{title}</CardTitle>
          <div className="p-2 bg-primary/10 rounded-lg">
            <Icon className="h-4 w-4 text-primary" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl mb-1">{value}</div>
          <p className="text-xs text-muted-foreground">{description}</p>
          {trend && (
            <div className="flex items-center gap-1 mt-2">
              {trendDirection === "up" ? (
                <TrendingUp className="h-3 w-3 text-green-600 dark:text-green-500" />
              ) : (
                <TrendingDown className="h-3 w-3 text-red-600 dark:text-red-500" />
              )}
              <span
                className={`text-xs ${
                  trendDirection === "up"
                    ? "text-green-600 dark:text-green-500"
                    : "text-red-600 dark:text-red-500"
                }`}
              >
                {trend}
              </span>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}

// Quick action card
function QuickActionCard({
  title,
  description,
  icon: Icon,
  onClick,
  index,
}: {
  title: string;
  description: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  icon: any;
  onClick?: () => void;
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, delay: 0.4 + index * 0.05 }}
    >
      <Card
        className="cursor-pointer hover:shadow-md hover:border-primary/50 transition-all group"
        onClick={onClick}
      >
        <CardHeader className="pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
              <Icon className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1">
              <CardTitle className="text-base mb-1">{title}</CardTitle>
              <CardDescription className="text-xs">
                {description}
              </CardDescription>
            </div>
            <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
          </div>
        </CardHeader>
      </Card>
    </motion.div>
  );
}

// Module card for navigation
function ModuleCard({
  title,
  description,
  icon: Icon,
  onClick,
  index,
}: {
  title: string;
  description: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  icon: any;
  onClick?: () => void;
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.6 + index * 0.03 }}
    >
      <Card
        className="cursor-pointer hover:shadow-md hover:border-primary/50 transition-all group h-full"
        onClick={onClick}
      >
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg group-hover:from-primary/20 group-hover:to-primary/10 transition-colors">
              <Icon className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="mb-1">{title}</h3>
              <p className="text-xs text-muted-foreground">{description}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export function DashboardPage() {
  const { data: session, update } = useSession();
  const t = useTranslations("Dashboard");

  // Mock data - in production, this would come from API
  const stats = [
    {
      title: t("stats.totalStudents"),
      value: "1,284",
      description: t("stats.studentsDesc"),
      icon: Users,
      trend: "+12%",
      trendDirection: "up" as const,
    },
    {
      title: t("stats.activeClasses"),
      value: "42",
      description: t("stats.classesDesc"),
      icon: GraduationCap,
    },
    {
      title: t("stats.totalTeachers"),
      value: "87",
      description: t("stats.teachersDesc"),
      icon: UserCheck,
    },
    {
      title: t("stats.attendance"),
      value: "94.2%",
      description: t("stats.attendanceDesc"),
      icon: BarChart3,
      trend: "+2.1%",
      trendDirection: "up" as const,
    },
    {
      title: t("stats.revenue"),
      value: "$54,280",
      description: t("stats.revenueDesc"),
      icon: DollarSign,
      trend: "+8%",
      trendDirection: "up" as const,
    },
    {
      title: t("stats.pendingAdmissions"),
      value: "23",
      description: t("stats.admissionsDesc"),
      icon: FileText,
    },
    {
      title: t("stats.outstandingFees"),
      value: "$12,450",
      description: t("stats.feesDesc"),
      icon: AlertCircle,
      trend: "-5%",
      trendDirection: "down" as const,
    },
    {
      title: t("stats.libraryBooks"),
      value: "5,432",
      description: t("stats.booksDesc"),
      icon: BookMarked,
    },
  ];

  const quickActions = [
    {
      title: t("quickActions.newStudent"),
      description: t("quickActions.newStudentDesc"),
      icon: Users,
    },
    {
      title: t("quickActions.processPayment"),
      description: t("quickActions.processPaymentDesc"),
      icon: CreditCard,
    },
    {
      title: t("quickActions.manageAdmissions"),
      description: t("quickActions.manageAdmissionsDesc"),
      icon: FileText,
    },
    {
      title: t("quickActions.reports"),
      description: t("quickActions.reportsDesc"),
      icon: BarChart3,
    },
  ];

  const modules = [
    {
      title: t("modules.admission"),
      description: t("modules.admissionDesc"),
      icon: FileText,
    },
    {
      title: t("modules.students"),
      description: t("modules.studentsDesc"),
      icon: Users,
    },
    {
      title: t("modules.classes"),
      description: t("modules.classesDesc"),
      icon: GraduationCap,
    },
    {
      title: t("modules.academic"),
      description: t("modules.academicDesc"),
      icon: BookOpen,
    },
    {
      title: t("modules.attendance"),
      description: t("modules.attendanceDesc"),
      icon: ClipboardCheck,
    },
    {
      title: t("modules.timetable"),
      description: t("modules.timetableDesc"),
      icon: Calendar,
    },
    {
      title: t("modules.fees"),
      description: t("modules.feesDesc"),
      icon: DollarSign,
    },
    {
      title: t("modules.payments"),
      description: t("modules.paymentsDesc"),
      icon: CreditCard,
    },
    {
      title: t("modules.library"),
      description: t("modules.libraryDesc"),
      icon: BookMarked,
    },
    {
      title: t("modules.transport"),
      description: t("modules.transportDesc"),
      icon: Bus,
    },
    {
      title: t("modules.hr"),
      description: t("modules.hrDesc"),
      icon: Briefcase,
    },
    {
      title: t("modules.reports"),
      description: t("modules.reportsDesc"),
      icon: BarChart3,
    },
  ];

  const recentActivities = [
    {
      title: "New student registered",
      description: "Sarah Johnson enrolled in Grade 10",
      time: "2 hours ago",
      icon: Users,
      color: "blue",
    },
    {
      title: "Payment received",
      description: "$1,200 tuition payment from John Doe",
      time: "5 hours ago",
      icon: DollarSign,
      color: "green",
    },
    {
      title: "Class scheduled",
      description: "Mathematics 101 added to Monday schedule",
      time: "1 day ago",
      icon: Calendar,
      color: "purple",
    },
    {
      title: "Admission application",
      description: "3 new applications awaiting review",
      time: "1 day ago",
      icon: FileText,
      color: "orange",
    },
  ];

  const announcements = [
    {
      title: "Mid-term examinations starting next week",
      date: "Posted 2 hours ago",
      priority: "high",
    },
    {
      title: "Parent-teacher meeting scheduled for Friday",
      date: "Posted 1 day ago",
      priority: "medium",
    },
    {
      title: "Library closed for maintenance this Saturday",
      date: "Posted 2 days ago",
      priority: "low",
    },
  ];

  const upcomingEvents = [
    {
      title: "Sports Day",
      date: "Nov 15, 2025",
      time: "9:00 AM",
    },
    {
      title: "Science Fair",
      date: "Nov 22, 2025",
      time: "10:00 AM",
    },
    {
      title: "Winter Break Starts",
      date: "Dec 20, 2025",
      time: "All Day",
    },
  ];

  return (
    // <div className="min-h-screen bg-background">
    <div>
      {/* Fixed Header */}
      {/* <DashboardHeaderNew /> */}
    </div>
  );
}
