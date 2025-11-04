"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import {
  GraduationCap,
  Search,
  Building2,
  MapPin,
  Users,
  CheckCircle2,
  ArrowRight,
  Loader2,
  AlertTriangle,
  X,
} from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Alert, AlertDescription } from "../ui/alert";
import { Badge } from "../ui/badge";
import { LanguageSwitcher } from "../LanguageSwitcher";
import { ThemeSwitcher } from "../ThemeSwitcher";
import { toast } from "sonner";
import { useCreateAccessRequest } from "@/hooks/useTenantAccess";
import { useSearchTenants } from "@/hooks/useTenant";
import { TenantSummary } from "@/lib/types/tenant-types";
import { UserRole } from "@/lib/types/auth-types";
import { useSession } from "next-auth/react";

interface RequestFormData {
  tenantId: string;
  requestedRole: UserRole;
  message: string;
}

export function RequestAccessPage() {
  const t = useTranslations("RequestAccess");
  const router = useRouter();
  const { update: updateSession } = useSession();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTenant, setSelectedTenant] = useState<TenantSummary | null>(
    null
  );
  const [showResults, setShowResults] = useState(false);
  const [formData, setFormData] = useState<RequestFormData>({
    tenantId: "",
    requestedRole: UserRole.STAFF,
    message: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Hooks
  const { results, isLoading: isSearching } = useSearchTenants(
    searchTerm,
    showResults
  );
  const { createRequestAsync, isLoading: isSubmitting } =
    useCreateAccessRequest();

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setShowResults(value.length > 0);
    if (value.length === 0) {
      setSelectedTenant(null);
    }
  };

  const handleSelectTenant = (tenant: TenantSummary) => {
    setSelectedTenant(tenant);
    setFormData({ ...formData, tenantId: tenant.id });
    setSearchTerm(tenant.name);
    setShowResults(false);
    setErrors({});
  };

  const handleClearSelection = () => {
    setSelectedTenant(null);
    setSearchTerm("");
    setFormData({ ...formData, tenantId: "" });
    setShowResults(false);
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.tenantId) {
      newErrors.tenant = t("errors.tenantRequired");
    }

    if (!formData.requestedRole) {
      newErrors.role = t("errors.roleRequired");
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error(t("errors.fillRequired"));
      return;
    }

    try {
      const createdRequest = await createRequestAsync({
        tenantId: formData.tenantId,
        requestedRole: formData.requestedRole,
        message: formData.message || undefined,
      });

      // Update the session to include pending request info
      await updateSession({
        user: {
          hasPendingRequest: true,
          pendingRequestId: createdRequest.id,
        },
      });

      toast.success(t("toast.success"));
      //   router.push("/auth/workspace");
      router.push("/auth/workspace/pending-request");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("Request access error:", error);
      const errorMessage =
        error?.response?.data?.message || t("errors.requestFailed");
      toast.error(errorMessage);
      setErrors({ submit: errorMessage });
    }
  };

  const roleOptions = [
    {
      value: UserRole.STAFF,
      label: t("roles.staff"),
      description: t("roles.staffDescription"),
    },
    {
      value: UserRole.TEACHER,
      label: t("roles.teacher"),
      description: t("roles.teacherDescription"),
    },
    {
      value: UserRole.ACCOUNTANT,
      label: t("roles.accountant"),
      description: t("roles.accountantDescription"),
    },
    {
      value: UserRole.LIBRARIAN,
      label: t("roles.librarian"),
      description: t("roles.librarianDescription"),
    },
    {
      value: UserRole.PARENT,
      label: t("roles.parent"),
      description: t("roles.parentDescription"),
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-slate-900">
      {/* Language & Theme Switchers - Top Corners */}
      <div className="fixed top-4 right-4 z-50 flex items-center gap-2">
        <LanguageSwitcher />
        <ThemeSwitcher />
      </div>

      <div className="flex flex-col items-center justify-center min-h-screen p-6">
        {/* Header */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="flex items-center justify-center gap-3 mb-4"
          >
            <div className="p-3 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl shadow-lg">
              <GraduationCap className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-semibold text-foreground">
                {t("appName")}
              </h1>
            </div>
          </motion.div>
          <p className="text-muted-foreground">{t("tagline")}</p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-2xl space-y-6"
        >
          {/* Main Card */}
          <Card className="border-0 shadow-2xl bg-card/95 backdrop-blur-sm">
            <CardHeader className="pb-6 px-8 pt-8">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Users className="h-5 w-5 text-primary" />
                </div>
                <CardTitle className="text-2xl">{t("title")}</CardTitle>
              </div>
              <CardDescription className="text-base">
                {t("description")}
              </CardDescription>
            </CardHeader>

            <CardContent className="px-8 pb-8 space-y-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Search Tenant */}
                <div className="space-y-3">
                  <Label htmlFor="tenant" className="text-base">
                    {t("form.tenant.label")}{" "}
                    <span className="text-destructive">*</span>
                  </Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input
                      id="tenant"
                      placeholder={t("form.tenant.placeholder")}
                      value={searchTerm}
                      onChange={(e) => handleSearchChange(e.target.value)}
                      className="pl-10 pr-10 h-12 text-base"
                      disabled={isSubmitting}
                    />
                    {selectedTenant && (
                      <button
                        type="button"
                        onClick={handleClearSelection}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    )}
                  </div>

                  {/* Search Results */}
                  {showResults && (
                    <Card className="absolute z-10 w-full mt-1 max-h-80 overflow-y-auto shadow-xl">
                      <CardContent className="p-2">
                        {isSearching ? (
                          <div className="flex items-center justify-center py-8">
                            <Loader2 className="h-6 w-6 animate-spin text-primary" />
                          </div>
                        ) : results.length === 0 ? (
                          <div className="text-center py-8 text-muted-foreground">
                            <Building2 className="h-12 w-12 mx-auto mb-3 opacity-50" />
                            <p>{t("form.tenant.noResults")}</p>
                          </div>
                        ) : (
                          <div className="space-y-1">
                            {results.map((tenant) => (
                              <button
                                key={tenant.id}
                                type="button"
                                onClick={() => handleSelectTenant(tenant)}
                                className="w-full text-left p-3 rounded-lg hover:bg-accent transition-colors"
                              >
                                <div className="flex items-start gap-3">
                                  <div className="p-2 bg-primary/10 rounded-lg">
                                    <Building2 className="h-5 w-5 text-primary" />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                      <h4 className="font-semibold text-foreground truncate">
                                        {tenant.name}
                                      </h4>
                                      <Badge
                                        variant="secondary"
                                        className="text-xs"
                                      >
                                        {tenant.slug}
                                      </Badge>
                                    </div>
                                    {tenant.address && (
                                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                        <MapPin className="h-3 w-3" />
                                        <span className="truncate">
                                          {tenant.address.city},{" "}
                                          {tenant.address.country}
                                        </span>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </button>
                            ))}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  )}

                  {/* Selected Tenant Display */}
                  {selectedTenant && !showResults && (
                    <Card className="border-primary/20 bg-primary/5">
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <div className="p-2 bg-primary/10 rounded-lg">
                            <Building2 className="h-5 w-5 text-primary" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-2">
                              <h4 className="font-semibold text-foreground">
                                {selectedTenant.name}
                              </h4>
                              <Badge variant="secondary">
                                {selectedTenant.slug}
                              </Badge>
                              <CheckCircle2 className="h-4 w-4 text-green-600 ml-auto" />
                            </div>
                            {selectedTenant.address && (
                              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                <MapPin className="h-3 w-3" />
                                <span>
                                  {selectedTenant.address.city},{" "}
                                  {selectedTenant.address.country}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {errors.tenant && (
                    <p className="text-sm text-destructive">{errors.tenant}</p>
                  )}
                </div>

                {/* Role Selection */}
                <div className="space-y-3">
                  <Label className="text-base">
                    {t("form.role.label")}{" "}
                    <span className="text-destructive">*</span>
                  </Label>
                  <div className="grid gap-3">
                    {roleOptions.map((option) => (
                      <label
                        key={option.value}
                        className={`
                          relative flex items-start gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all
                          ${
                            formData.requestedRole === option.value
                              ? "border-primary bg-primary/5"
                              : "border-border hover:border-primary/50 hover:bg-accent"
                          }
                        `}
                      >
                        <input
                          type="radio"
                          name="role"
                          value={option.value}
                          checked={formData.requestedRole === option.value}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              requestedRole: e.target.value as UserRole,
                            })
                          }
                          className="mt-1"
                          disabled={isSubmitting}
                        />
                        <div className="flex-1">
                          <div className="font-medium text-foreground mb-1">
                            {option.label}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {option.description}
                          </div>
                        </div>
                        {formData.requestedRole === option.value && (
                          <CheckCircle2 className="h-5 w-5 text-primary mt-1" />
                        )}
                      </label>
                    ))}
                  </div>
                  {errors.role && (
                    <p className="text-sm text-destructive">{errors.role}</p>
                  )}
                </div>

                {/* Message (Optional) */}
                <div className="space-y-3">
                  <Label htmlFor="message" className="text-base">
                    {t("form.message.label")}{" "}
                    <span className="text-muted-foreground text-sm">
                      ({t("form.message.optional")})
                    </span>
                  </Label>
                  <textarea
                    id="message"
                    rows={4}
                    placeholder={t("form.message.placeholder")}
                    value={formData.message}
                    onChange={(e) =>
                      setFormData({ ...formData, message: e.target.value })
                    }
                    maxLength={1000}
                    className="w-full px-4 py-3 border border-input rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-ring bg-background text-foreground"
                    disabled={isSubmitting}
                  />
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>{t("form.message.help")}</span>
                    <span>{formData.message.length}/1000</span>
                  </div>
                </div>

                {/* Error Alert */}
                {errors.submit && (
                  <Alert
                    variant="destructive"
                    className="border-destructive/20 bg-destructive/5"
                  >
                    <AlertTriangle className="h-5 w-5" />
                    <AlertDescription className="font-medium">
                      {errors.submit}
                    </AlertDescription>
                  </Alert>
                )}

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.back()}
                    className="flex-1"
                    disabled={isSubmitting}
                  >
                    {t("buttons.cancel")}
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1 h-12 text-base font-medium shadow-lg hover:shadow-xl transition-all duration-200"
                    disabled={isSubmitting || !formData.tenantId}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        {t("buttons.submitting")}
                      </>
                    ) : (
                      <>
                        {t("buttons.submit")}
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Info Card */}
          <Card className="border-blue-200 bg-blue-50 dark:border-blue-900 dark:bg-blue-950/30">
            <CardContent className="p-6">
              <div className="flex gap-4">
                <div className="p-2 bg-blue-600 rounded-lg h-fit">
                  <AlertTriangle className="h-5 w-5 text-white" />
                </div>
                <div className="space-y-2">
                  <h3 className="font-semibold text-foreground">
                    {t("info.title")}
                  </h3>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                      <span>{t("info.point1")}</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                      <span>{t("info.point2")}</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                      <span>{t("info.point3")}</span>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
