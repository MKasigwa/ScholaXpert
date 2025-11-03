"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "motion/react";
import { useTranslations } from "next-intl";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  GraduationCap,
  Mail,
  ArrowRight,
  AlertTriangle,
  RefreshCw,
  Clock,
  Loader2,
} from "lucide-react";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Alert, AlertDescription } from "../ui/alert";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "../ui/input-otp";
import { LanguageSwitcher } from "../LanguageSwitcher";
import { toast } from "sonner";
import {
  VerifyEmailDto,
  ResendVerificationCodeDto,
} from "@/lib/types/auth-types";
import { useResendVerificationCode, useVerifyEmail } from "@/hooks/useAuth";
import { ThemeSwitcher } from "../ThemeSwitcher";

export function EmailVerificationPage() {
  const t = useTranslations("EmailVerification");
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session, update: updateSession } = useSession();
  const otpRef = useRef<HTMLInputElement>(null);

  // Use hooks for email verification and resend code
  const {
    verifyEmailAsync,
    isLoading,
    isError,
    error: verifyError,
  } = useVerifyEmail();
  const {
    resendCodeAsync,
    isLoading: isResending,
    error: resendError,
  } = useResendVerificationCode();

  const email = searchParams.get("email") || session?.user?.email || "";

  const [code, setCode] = useState("");
  const [timeLeft, setTimeLeft] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const maxAttempts = 5;

  // Auto-focus the OTP input when the component mounts
  useEffect(() => {
    const timer = setTimeout(() => {
      if (otpRef.current) {
        otpRef.current.focus();
      }
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  // Handle resend cooldown timer
  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [timeLeft]);

  // Auto-submit when code is complete
  useEffect(() => {
    if (code.length === 6) {
      handleSubmit();
    }
  }, [code]);

  const handleCodeChange = (value: string) => {
    // Only allow numeric input
    const numericValue = value.replace(/\D/g, "");
    setCode(numericValue);
    setError(null);
  };

  const handleSubmit = async () => {
    if (code.length !== 6) return;

    setAttempts((prev) => prev + 1);
    setError(null);

    try {
      // Prepare verification data
      const verifyData: VerifyEmailDto = {
        email,
        code,
      };

      // Call the verification API using AuthApi
      const response = await verifyEmailAsync(verifyData);

      if (!response.success) {
        throw new Error(response.message || "Verification failed");
      }

      // Update session to reflect email verification
      await updateSession({
        user: {
          ...session?.user,
          isEmailVerified: true,
        },
      });

      toast.success(t("toast.success"));
      router.push("/auth/workspace");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.error("Verification error:", err);

      // Handle different types of errors with proper Axios error structure
      const errorMessage =
        err?.response?.data?.message || err?.message || t("errors.generic");
      setError(errorMessage);
      toast.error(errorMessage);

      // Clear the code input
      setCode("");

      // Focus back on input
      if (otpRef.current) {
        otpRef.current.focus();
      }
    }
  };

  const handleResend = async () => {
    if (timeLeft > 0 || isResending) return;

    setError(null);

    try {
      // Prepare resend data
      const resendData: ResendVerificationCodeDto = {
        email,
      };

      // Call the resend API using AuthApi
      const response = await resendCodeAsync(resendData);

      if (!response.success) {
        throw new Error(response.message || "Failed to resend code");
      }

      setCode("");
      setAttempts(0);

      // Use the expiresIn value from the response (convert to seconds if needed)
      const cooldownTime = response.expiresIn || 60;
      setTimeLeft(cooldownTime);

      toast.success(t("toast.codeSent"));
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.error("Resend error:", err);

      // Handle different types of errors with proper Axios error structure
      const errorMessage =
        err?.response?.data?.message || err?.message || t("toast.resendError");
      setError(errorMessage);
      toast.error(errorMessage);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const isCodeComplete = code.length === 6;
  const isMaxAttemptsReached = attempts >= maxAttempts;
  const canResend = timeLeft === 0 && !isResending && !isMaxAttemptsReached;

  if (!email) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-slate-900">
        <Card className="max-w-md w-full">
          <CardHeader className="w-full">
            <CardTitle>{t("errors.noEmail")}</CardTitle>
            <CardDescription>{t("errors.noEmailDescription")}</CardDescription>
          </CardHeader>
          <CardContent className="w-full">
            <Button
              onClick={() => router.push("/auth/sign-in")}
              className="w-full"
            >
              {t("backToSignIn")}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

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
          className="w-full max-w-md space-y-6"
        >
          {/* Verification Card */}
          <Card className="border-0 shadow-2xl bg-card/95 backdrop-blur-sm">
            <CardHeader className="text-center pb-6 px-8 pt-8">
              <div className="w-20 h-20 mx-auto mb-6 bg-primary/10 rounded-full flex items-center justify-center">
                <Mail className="h-10 w-10 text-primary" />
              </div>
              <CardTitle className="text-2xl font-semibold">
                {t("title")}
              </CardTitle>
              <CardDescription className="text-base text-muted-foreground leading-relaxed">
                {t("description")} <br />
                <span className="font-medium text-foreground">{email}</span>
              </CardDescription>
            </CardHeader>

            <CardContent className="px-8 pb-8 space-y-6">
              {/* OTP Input */}
              <div className="space-y-4">
                <div className="text-center">
                  <label className="text-sm font-medium text-foreground mb-4 block">
                    {t("inputLabel")}
                  </label>
                  <div className="flex justify-center">
                    <InputOTP
                      ref={otpRef}
                      maxLength={6}
                      value={code}
                      onChange={handleCodeChange}
                      disabled={isLoading || isMaxAttemptsReached}
                    >
                      <InputOTPGroup>
                        <InputOTPSlot
                          index={0}
                          className="w-12 h-12 text-lg font-semibold"
                        />
                        <InputOTPSlot
                          index={1}
                          className="w-12 h-12 text-lg font-semibold"
                        />
                        <InputOTPSlot
                          index={2}
                          className="w-12 h-12 text-lg font-semibold"
                        />
                        <InputOTPSlot
                          index={3}
                          className="w-12 h-12 text-lg font-semibold"
                        />
                        <InputOTPSlot
                          index={4}
                          className="w-12 h-12 text-lg font-semibold"
                        />
                        <InputOTPSlot
                          index={5}
                          className="w-12 h-12 text-lg font-semibold"
                        />
                      </InputOTPGroup>
                    </InputOTP>
                  </div>
                </div>

                {/* Attempts Counter */}
                {attempts > 0 && !isMaxAttemptsReached && (
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">
                      {t("attempts.label", {
                        current: attempts,
                        max: maxAttempts,
                      })}
                    </p>
                  </div>
                )}
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

              {/* Max Attempts Reached */}
              {isMaxAttemptsReached && (
                <Alert
                  variant="destructive"
                  className="border-destructive/20 bg-destructive/5"
                >
                  <AlertTriangle className="h-5 w-5" />
                  <AlertDescription className="font-medium">
                    {t("errors.maxAttempts")}
                  </AlertDescription>
                </Alert>
              )}

              {/* Submit Button */}
              <Button
                onClick={handleSubmit}
                className="w-full h-12 text-base font-medium shadow-lg hover:shadow-xl transition-all duration-200"
                disabled={!isCodeComplete || isLoading || isMaxAttemptsReached}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    {t("verifying")}
                  </>
                ) : (
                  <>
                    {t("verifyButton")}
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </>
                )}
              </Button>

              {/* Resend Section */}
              <div className="pt-4 border-t border-border">
                <div className="flex flex-col items-center gap-3">
                  <p className="text-sm text-muted-foreground text-center">
                    {t("didntReceive")}
                  </p>

                  {timeLeft > 0 ? (
                    <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      <span>
                        {t("resendIn", { time: formatTime(timeLeft) })}
                      </span>
                    </div>
                  ) : (
                    <Button
                      variant="outline"
                      onClick={handleResend}
                      disabled={!canResend}
                      className="w-full"
                    >
                      {isResending ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          {t("sending")}
                        </>
                      ) : (
                        <>
                          <RefreshCw className="mr-2 h-4 w-4" />
                          {t("resendCode")}
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Help Text */}
          <div className="text-center space-y-2">
            <p className="text-sm text-muted-foreground">{t("helpText")}</p>
            <Button
              variant="link"
              onClick={() => router.push("/auth/sign-in")}
              className="text-sm"
            >
              {t("backToSignIn")}
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
