"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "motion/react";
import { useTranslations } from "next-intl";
import { useRouter, useSearchParams } from "next/navigation";
import {
  GraduationCap,
  Mail,
  ArrowRight,
  ArrowLeft,
  AlertTriangle,
  Loader2,
  Eye,
  EyeOff,
  CheckCircle2,
  Clock,
  RefreshCw,
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
import { InputOTP, InputOTPGroup, InputOTPSlot } from "../ui/input-otp";
import { LanguageSwitcher } from "../LanguageSwitcher";
import { ThemeSwitcher } from "../ThemeSwitcher";
import { toast } from "sonner";
import {
  useVerifyResetCode,
  useResetPassword,
  useForgotPassword,
} from "@/hooks/useAuth";

export function ResetPasswordPage() {
  const t = useTranslations("ResetPassword");
  const router = useRouter();
  const searchParams = useSearchParams();
  const otpRef = useRef<HTMLInputElement>(null);

  const { verifyResetCodeAsync, isLoading: isVerifying } = useVerifyResetCode();
  const { resetPasswordAsync, isLoading: isResetting } = useResetPassword();
  const { forgotPasswordAsync, isLoading: isResending } = useForgotPassword();

  const email = searchParams.get("email") || "";

  const [step, setStep] = useState(1); // 1: Verify Code, 2: Reset Password
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [attempts, setAttempts] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);

  const maxAttempts = 5;

  // Auto-focus the OTP input when the component mounts
  useEffect(() => {
    if (step === 1) {
      const timer = setTimeout(() => {
        if (otpRef.current) {
          otpRef.current.focus();
        }
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [step]);

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
    if (code.length === 6 && step === 1) {
      handleVerifyCode();
    }
  }, [code]);

  // Redirect if no email
  if (!email) {
    router.push("/auth/forgot-password");
    return null;
  }

  const handleCodeChange = (value: string) => {
    const numericValue = value.replace(/\D/g, "");
    setCode(numericValue);
    setError(null);
  };

  const handleVerifyCode = async () => {
    if (code.length !== 6) return;

    setAttempts((prev) => prev + 1);
    setError(null);

    try {
      const response = await verifyResetCodeAsync({ email, code });

      if (response.success) {
        setStep(2);
        toast.success(t("toast.codeVerified"));
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.error("Verify code error:", err);
      const errorMessage =
        err?.response?.data?.message || err?.message || t("errors.codeInvalid");
      setError(errorMessage);
      toast.error(errorMessage);
      setCode("");
      if (otpRef.current) {
        otpRef.current.focus();
      }
    }
  };

  const handleResend = async () => {
    if (timeLeft > 0 || isResending) return;

    setError(null);

    try {
      const response = await forgotPasswordAsync({ email });

      if (response.success) {
        setCode("");
        setAttempts(0);
        const cooldownTime = response.expiresIn || 60;
        setTimeLeft(cooldownTime);
        toast.success(t("toast.codeSent"));
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.error("Resend error:", err);
      const errorMessage =
        err?.response?.data?.message || err?.message || t("errors.generic");
      setError(errorMessage);
      toast.error(errorMessage);
    }
  };

  const validatePassword = (password: string): boolean => {
    const hasMinLength = password.length >= 8;
    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecial = /[@$!%*?&]/.test(password);

    return (
      hasMinLength && hasUppercase && hasLowercase && hasNumber && hasSpecial
    );
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validate password
    if (!newPassword) {
      setError(t("errors.passwordRequired"));
      return;
    }

    if (newPassword.length < 8) {
      setError(t("errors.passwordTooShort"));
      return;
    }

    if (!validatePassword(newPassword)) {
      setError(t("errors.passwordWeak"));
      return;
    }

    if (!confirmPassword) {
      setError(t("errors.confirmRequired"));
      return;
    }

    if (newPassword !== confirmPassword) {
      setError(t("errors.passwordMismatch"));
      return;
    }

    try {
      const response = await resetPasswordAsync({ email, code, newPassword });

      if (response.success) {
        toast.success(t("toast.passwordReset"));
        router.push("/auth/sign-in");
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.error("Reset password error:", err);
      const errorMessage =
        err?.response?.data?.message || err?.message || t("errors.resetFailed");
      setError(errorMessage);
      toast.error(errorMessage);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const isMaxAttemptsReached = attempts >= maxAttempts;
  const canResend = timeLeft === 0 && !isResending && !isMaxAttemptsReached;

  // Password requirements check
  const passwordRequirements = [
    {
      key: "minLength",
      met: newPassword.length >= 8,
      label: t("step2.requirements.minLength"),
    },
    {
      key: "uppercase",
      met: /[A-Z]/.test(newPassword),
      label: t("step2.requirements.uppercase"),
    },
    {
      key: "lowercase",
      met: /[a-z]/.test(newPassword),
      label: t("step2.requirements.lowercase"),
    },
    {
      key: "number",
      met: /\d/.test(newPassword),
      label: t("step2.requirements.number"),
    },
    {
      key: "special",
      met: /[@$!%*?&]/.test(newPassword),
      label: t("step2.requirements.special"),
    },
  ];

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
          className="w-full max-w-md space-y-6"
        >
          {/* Step Indicator */}
          <div className="flex items-center justify-center gap-4">
            <div
              className={`flex items-center gap-2 ${
                step === 1
                  ? "text-primary"
                  : "text-green-600 dark:text-green-400"
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  step === 1
                    ? "bg-primary text-primary-foreground"
                    : "bg-green-100 dark:bg-green-900/30"
                }`}
              >
                {step === 1 ? "1" : <CheckCircle2 className="h-5 w-5" />}
              </div>
              <span className="text-sm font-medium">Verify Code</span>
            </div>
            <div
              className={`h-px w-12 ${step === 2 ? "bg-primary" : "bg-border"}`}
            />
            <div
              className={`flex items-center gap-2 ${
                step === 2 ? "text-primary" : "text-muted-foreground"
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  step === 2 ? "bg-primary text-primary-foreground" : "bg-muted"
                }`}
              >
                2
              </div>
              <span className="text-sm font-medium">New Password</span>
            </div>
          </div>

          {/* Card */}
          <Card className="border-0 shadow-2xl bg-card/95 backdrop-blur-sm">
            {step === 1 ? (
              // Step 1: Verify Code
              <>
                <CardHeader className="text-center pb-6 px-8 pt-8">
                  <div className="w-20 h-20 mx-auto mb-6 bg-primary/10 rounded-full flex items-center justify-center">
                    <Mail className="h-10 w-10 text-primary" />
                  </div>
                  <CardTitle className="text-2xl font-semibold">
                    {t("step1.title")}
                  </CardTitle>
                  <CardDescription className="text-base text-muted-foreground leading-relaxed">
                    {t("step1.subtitle")} <br />
                    <span className="font-medium text-foreground">{email}</span>
                  </CardDescription>
                </CardHeader>

                <CardContent className="px-8 pb-8 space-y-6">
                  {/* OTP Input */}
                  <div className="space-y-4">
                    <div className="text-center">
                      <label className="text-sm font-medium text-foreground mb-4 block">
                        {t("step1.inputLabel")}
                      </label>
                      <div className="flex justify-center">
                        <InputOTP
                          ref={otpRef}
                          maxLength={6}
                          value={code}
                          onChange={handleCodeChange}
                          disabled={isVerifying || isMaxAttemptsReached}
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
                          {t("step1.attempts", {
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

                  {/* Max Attempts */}
                  {isMaxAttemptsReached && (
                    <Alert
                      variant="destructive"
                      className="border-destructive/20 bg-destructive/5"
                    >
                      <AlertTriangle className="h-5 w-5" />
                      <AlertDescription className="font-medium">
                        {t("step1.attemptsError")}
                      </AlertDescription>
                    </Alert>
                  )}

                  {/* Verify Button */}
                  <Button
                    onClick={handleVerifyCode}
                    className="w-full h-12 text-base font-medium shadow-lg hover:shadow-xl transition-all duration-200"
                    disabled={
                      code.length !== 6 || isVerifying || isMaxAttemptsReached
                    }
                  >
                    {isVerifying ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        {t("step1.verifying")}
                      </>
                    ) : (
                      <>
                        {t("step1.verifyButton")}
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </>
                    )}
                  </Button>

                  {/* Resend Section */}
                  <div className="pt-4 border-t border-border">
                    <div className="flex flex-col items-center gap-3">
                      <p className="text-sm text-muted-foreground text-center">
                        {t("step1.resendLabel")}
                      </p>

                      {timeLeft > 0 ? (
                        <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                          <Clock className="h-4 w-4" />
                          <span>
                            {t("step1.resendIn", {
                              time: formatTime(timeLeft),
                            })}
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
                              {t("step1.sending")}
                            </>
                          ) : (
                            <>
                              <RefreshCw className="mr-2 h-4 w-4" />
                              {t("step1.resendButton")}
                            </>
                          )}
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </>
            ) : (
              // Step 2: Reset Password
              <>
                <CardHeader className="text-center pb-6 px-8 pt-8">
                  <div className="w-20 h-20 mx-auto mb-6 bg-primary/10 rounded-full flex items-center justify-center">
                    <CheckCircle2 className="h-10 w-10 text-primary" />
                  </div>
                  <CardTitle className="text-2xl font-semibold">
                    {t("step2.title")}
                  </CardTitle>
                  <CardDescription className="text-base text-muted-foreground leading-relaxed">
                    {t("step2.subtitle")}
                  </CardDescription>
                </CardHeader>

                <CardContent className="px-8 pb-8">
                  <form onSubmit={handleResetPassword} className="space-y-6">
                    {/* New Password */}
                    <div className="space-y-2">
                      <Label
                        htmlFor="newPassword"
                        className="text-base font-medium"
                      >
                        {t("step2.newPasswordLabel")}
                      </Label>
                      <div className="relative">
                        <Input
                          id="newPassword"
                          type={showPassword ? "text" : "password"}
                          placeholder={t("step2.newPasswordPlaceholder")}
                          value={newPassword}
                          onChange={(e) => {
                            setNewPassword(e.target.value);
                            setError(null);
                          }}
                          disabled={isResetting}
                          className="h-12 text-base pr-12"
                          autoFocus
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                        >
                          {showPassword ? (
                            <EyeOff className="h-5 w-5" />
                          ) : (
                            <Eye className="h-5 w-5" />
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Confirm Password */}
                    <div className="space-y-2">
                      <Label
                        htmlFor="confirmPassword"
                        className="text-base font-medium"
                      >
                        {t("step2.confirmPasswordLabel")}
                      </Label>
                      <div className="relative">
                        <Input
                          id="confirmPassword"
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder={t("step2.confirmPasswordPlaceholder")}
                          value={confirmPassword}
                          onChange={(e) => {
                            setConfirmPassword(e.target.value);
                            setError(null);
                          }}
                          disabled={isResetting}
                          className="h-12 text-base pr-12"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                          }
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                        >
                          {showConfirmPassword ? (
                            <EyeOff className="h-5 w-5" />
                          ) : (
                            <Eye className="h-5 w-5" />
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Password Requirements */}
                    {newPassword && (
                      <div className="p-4 bg-muted/50 rounded-lg space-y-2">
                        <p className="text-sm font-medium text-foreground">
                          {t("step2.requirements.title")}
                        </p>
                        <div className="space-y-1">
                          {passwordRequirements.map((req) => (
                            <div
                              key={req.key}
                              className="flex items-center gap-2 text-sm"
                            >
                              <div
                                className={`w-4 h-4 rounded-full flex items-center justify-center ${
                                  req.met
                                    ? "bg-green-100 dark:bg-green-900/30"
                                    : "bg-gray-200 dark:bg-gray-700"
                                }`}
                              >
                                {req.met && (
                                  <CheckCircle2 className="h-3 w-3 text-green-600 dark:text-green-400" />
                                )}
                              </div>
                              <span
                                className={
                                  req.met
                                    ? "text-green-600 dark:text-green-400"
                                    : "text-muted-foreground"
                                }
                              >
                                {req.label}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

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

                    {/* Reset Button */}
                    <Button
                      type="submit"
                      className="w-full h-12 text-base font-medium shadow-lg hover:shadow-xl transition-all duration-200"
                      disabled={isResetting || !newPassword || !confirmPassword}
                    >
                      {isResetting ? (
                        <>
                          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                          {t("step2.resetting")}
                        </>
                      ) : (
                        <>
                          {t("step2.resetButton")}
                          <ArrowRight className="ml-2 h-5 w-5" />
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </>
            )}
          </Card>

          {/* Back to Sign In */}
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
        </motion.div>
      </div>
    </div>
  );
}
