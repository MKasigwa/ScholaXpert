"use client";

import { useTranslations } from "next-intl";
import { Layout } from "@/components/Layout";
import { useParams } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar } from "lucide-react";
import { useAppStore } from "../../../../../store/useAppStore";
import { SchoolYearManagementWithApi } from "@/components/school-years/SchoolYearManagementPage";
// import { useAppStore } from "@/store/useAppStore";
// import { SchoolYearManagementWithApi } from "@/components/SchoolYearManagementWithApi";

export default function SchoolYearManagementPage() {
  const params = useParams();
  const locale = params.locale as string;
  const t = useTranslations("SchoolYearManagement");
  const { selectedTenant } = useAppStore();

  return (
    <Layout locale={locale}>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="flex items-center gap-2">
              <Calendar className="h-8 w-8" />
              {t("title")}
            </h1>
            <p className="text-muted-foreground mt-1">{t("description")}</p>
          </div>
        </div>

        {/* Tenant Selection Notice */}
        {!selectedTenant ? (
          <Card>
            <CardContent className="p-6 text-center">
              <p className="text-muted-foreground">{t("selectTenant")}</p>
            </CardContent>
          </Card>
        ) : (
          <SchoolYearManagementWithApi />
        )}
      </div>
    </Layout>
  );
}
