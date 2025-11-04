"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import {
  GraduationCap,
  Mail,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Loader2,
  AlertTriangle,
} from "lucide-react";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Alert, AlertDescription } from "../ui/alert";
import { LanguageSwitcher } from "../LanguageSwitcher";
import { ThemeSwitcher } from "../ThemeSwitcher";
import { toast } from "sonner";
import { useForgotPassword } from "@/hooks/useAuth";

export function ForgotPasswordPage() {
  const t = useTranslations("ForgotPassword");
  const router = useRouter();
  const { forgotPasswordAsync, isLoading } = useForgotPassword();

  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validate email
    if (!email) {
      setError(t("errors.emailRequired"));
      return;
    }

    if (!validateEmail(email)) {
      setError(t("errors.emailInvalid"));
      return;
    }

    try {
      const response = await forgotPasswordAsync({ email });

      if (response.success) {
        setSuccess(true);
        toast.success(t("toast.success"));
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.error("Forgot password error:", err);
      const errorMessage =
        err?.response?.data?.message || err?.message || t("errors.sendFailed");
      setError(errorMessage);
      toast.error(errorMessage);
    }
  };

  const handleContinue = () => {
    router.push(`/auth/reset-password?email=${encodeURIComponent(email)}`);
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-slate-900">
        {/* Language and Theme Switchers - Top Right */}
        <div className="fixed top-4 right-4 z-50 flex items-center gap-2">
          <ThemeSwitcher />
          <LanguageSwitcher />
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
            className="w-full max-w-md"
          >
            {/* Success Card */}
            <Card className="border-0 shadow-2xl bg-card/95 backdrop-blur-sm">
              <CardHeader className="text-center pb-6 px-8 pt-8">
                <div className="w-20 h-20 mx-auto mb-6 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                  <CheckCircle2 className="h-10 w-10 text-green-600 dark:text-green-400" />
                </div>
                <CardTitle className="text-2xl font-semibold">
                  {t("success.title")}
                </CardTitle>
                <CardDescription className="text-base text-muted-foreground leading-relaxed mt-2">
                  {t("success.message")}
                  <br />
                  <span className="font-medium text-foreground">{email}</span>
                </CardDescription>
              </CardHeader>

              <CardContent className="px-8 pb-8 space-y-6">
                <div className="p-4 bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-200 dark:border-blue-800">
                  <p className="text-sm text-blue-900 dark:text-blue-100">
                    {t("success.nextSteps")}
                  </p>
                </div>

                <Button
                  onClick={handleContinue}
                  className="w-full h-12 text-base font-medium shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  {t("success.continueButton")}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>

                <div className="text-center">
                  <Button
                    variant="link"
                    onClick={() => router.push("/auth/sign-in")}
                    className="text-sm"
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    {t("backToSignIn")}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-slate-900">
      {/* Language and Theme Switchers - Top Right */}
      <div className="fixed top-4 right-4 z-50 flex items-center gap-2">
        <ThemeSwitcher />
        <LanguageSwitcher />
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
          className="w-full max-w-md"
        >
          {/* Form Card */}
          <Card className="border-0 shadow-2xl bg-card/95 backdrop-blur-sm">
            <CardHeader className="text-center pb-6 px-8 pt-8">
              <div className="w-20 h-20 mx-auto mb-6 bg-primary/10 rounded-full flex items-center justify-center">
                <Mail className="h-10 w-10 text-primary" />
              </div>
              <CardTitle className="text-2xl font-semibold">
                {t("title")}
              </CardTitle>
              <CardDescription className="text-base text-muted-foreground leading-relaxed">
                {t("subtitle")}
              </CardDescription>
            </CardHeader>

            <CardContent className="px-8 pb-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Email Input */}
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-base font-medium">
                    {t("emailLabel")}
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder={t("emailPlaceholder")}
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setError(null);
                    }}
                    disabled={isLoading}
                    className="h-12 text-base"
                    autoFocus
                  />
                </div>

                {/* Error Message */}
                {error && (
                  <Alert
                    variant="destructive"
                    className="border-destructive/20 bg-destructive/5"
                  >
                    <AlertTriangle className="h-5 w-5" />
                    <AlertDescription className="font-medium">
                      {error}
                    </AlertDescription>
                  </Alert>
                )}

                {/* Submit Button */}
                <Button
                  type="submit"
                  className="w-full h-12 text-base font-medium shadow-lg hover:shadow-xl transition-all duration-200"
                  disabled={isLoading || !email}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      {t("sendingButton")}
                    </>
                  ) : (
                    <>
                      {t("sendCodeButton")}
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </>
                  )}
                </Button>
              </form>

              {/* Help Text */}
              <div className="mt-6 text-center space-y-2">
                <p className="text-sm text-muted-foreground">{t("helpText")}</p>
                <Button
                  variant="link"
                  onClick={() => router.push("/auth/sign-in")}
                  className="text-sm"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  {t("backToSignIn")}
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
