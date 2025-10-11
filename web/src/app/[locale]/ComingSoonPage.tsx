"use client";

import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { useTranslations } from "next-intl";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  GraduationCap,
  Users,
  BarChart3,
  Calendar,
  BookOpen,
  Bell,
  Shield,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Mail,
  Clock,
} from "lucide-react";
import { ImageWithFallback } from "./images/ImageWithFallback";
import { LanguageSwitcher } from "./LanguageSwitcher";

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export function ComingSoonPage() {
  const t = useTranslations("ComingSoon");
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 45,
    hours: 12,
    minutes: 30,
    seconds: 0,
  });

  // Launch date countdown
  useEffect(() => {
    const launchDate = new Date();
    launchDate.setDate(launchDate.getDate() + 45);
    launchDate.setHours(12, 0, 0, 0);

    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = launchDate.getTime() - now;

      if (distance < 0) {
        clearInterval(timer);
        return;
      }

      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor(
          (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        ),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000),
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setIsSubmitted(true);
      setTimeout(() => {
        setEmail("");
        setIsSubmitted(false);
      }, 3000);
    }
  };

  const features = [
    {
      icon: Users,
      title: t("features.studentManagement.title"),
      description: t("features.studentManagement.description"),
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      icon: Calendar,
      title: t("features.smartScheduling.title"),
      description: t("features.smartScheduling.description"),
      gradient: "from-purple-500 to-pink-500",
    },
    {
      icon: BarChart3,
      title: t("features.advancedAnalytics.title"),
      description: t("features.advancedAnalytics.description"),
      gradient: "from-orange-500 to-red-500",
    },
    {
      icon: BookOpen,
      title: t("features.academicExcellence.title"),
      description: t("features.academicExcellence.description"),
      gradient: "from-green-500 to-emerald-500",
    },
    {
      icon: Shield,
      title: t("features.securityCompliance.title"),
      description: t("features.securityCompliance.description"),
      gradient: "from-indigo-500 to-blue-500",
    },
    {
      icon: Bell,
      title: t("features.communicationHub.title"),
      description: t("features.communicationHub.description"),
      gradient: "from-pink-500 to-rose-500",
    },
  ];

  const stats = [
    { value: "50K+", label: t("stats.studentsReady") },
    { value: "200+", label: t("stats.schoolsWaiting") },
    { value: "15+", label: t("stats.modules") },
    { value: "99.9%", label: t("stats.uptimeSLA") },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-background overflow-hidden">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-purple-500/5 rounded-full blur-3xl animate-pulse delay-500" />
      </div>

      <div className="relative z-10">
        {/* Header */}
        <motion.header
          className="border-b border-border/50 backdrop-blur-sm bg-background/80"
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
                  <GraduationCap className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold">ScholaXpert</h1>
                  <p className="text-xs text-muted-foreground">
                    {t("tagline")}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <LanguageSwitcher />
                <Badge variant="secondary" className="gap-1">
                  <Sparkles className="h-3 w-3" />
                  {t("comingSoon")}
                </Badge>
              </div>
            </div>
          </div>
        </motion.header>

        {/* Hero Section */}
        <section className="container mx-auto px-4 py-16 md:py-24">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <Badge className="mb-4 gap-1">
                  <Clock className="h-3 w-3" />
                  {t("launchingSoon")}
                </Badge>
                <h1 className="text-4xl md:text-6xl font-bold leading-tight bg-gradient-to-r from-primary via-blue-600 to-purple-600 bg-clip-text text-transparent">
                  {t("heroTitle")}
                </h1>
                <p className="text-xl text-muted-foreground mt-6">
                  {t("heroDescription")}
                </p>
              </motion.div>

              {/* Countdown Timer */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="grid grid-cols-4 gap-4"
              >
                {[
                  { value: timeLeft.days, label: t("countdown.days") },
                  { value: timeLeft.hours, label: t("countdown.hours") },
                  { value: timeLeft.minutes, label: t("countdown.minutes") },
                  { value: timeLeft.seconds, label: t("countdown.seconds") },
                ].map((item, index) => (
                  <Card
                    key={index}
                    className="bg-gradient-to-br from-card to-secondary/20 border-2"
                  >
                    <CardContent className="p-4 text-center">
                      <div className="text-3xl font-bold bg-gradient-to-br from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        {item.value.toString().padStart(2, "0")}
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {item.label}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </motion.div>

              {/* Email Signup */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
              >
                {!isSubmitted ? (
                  <form onSubmit={handleSubmit} className="flex gap-2">
                    <div className="relative flex-1">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                      <Input
                        type="email"
                        placeholder={t("email.placeholder")}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-10 h-12"
                        required
                      />
                    </div>
                    <Button type="submit" size="lg" className="gap-2 h-12">
                      {t("email.notifyMe")}
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </form>
                ) : (
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="flex items-center gap-2 p-4 bg-green-500/10 border border-green-500/20 rounded-lg"
                  >
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                    <span className="text-green-700 dark:text-green-400">
                      {t("email.thankYou")}
                    </span>
                  </motion.div>
                )}
                <p className="text-sm text-muted-foreground mt-2">
                  {t("email.waitlist")}
                </p>
              </motion.div>

              {/* Stats */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.8 }}
                className="grid grid-cols-4 gap-4 pt-8 border-t border-border/50"
              >
                {stats.map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="text-2xl font-bold text-primary">
                      {stat.value}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </motion.div>
            </div>

            {/* Right Image */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="relative"
            >
              <div className="relative rounded-2xl overflow-hidden border-4 border-border shadow-2xl">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1528249072419-472a928b71c9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBzY2hvb2wlMjBzdHVkZW50cyUyMHRlY2hub2xvZ3l8ZW58MXx8fHwxNzU5OTIxNjcxfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                  alt="Modern school technology"
                  className="w-full h-auto"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              </div>

              {/* Floating Feature Cards */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute -bottom-6 -left-6 bg-card border-2 border-border rounded-xl p-4 shadow-xl"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
                    <CheckCircle2 className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <div className="font-semibold">
                      {t("floating.multiTenant")}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {t("floating.architecture")}
                    </div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 0.5,
                }}
                className="absolute -top-6 -right-6 bg-card border-2 border-border rounded-xl p-4 shadow-xl"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                    <Shield className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <div className="font-semibold">
                      {t("floating.gdprReady")}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {t("floating.compliant")}
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="container mx-auto px-4 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <Badge className="mb-4">{t("features.sectionBadge")}</Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              {t("features.sectionTitle")}
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {t("features.sectionDescription")}
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
              >
                <Card className="h-full hover:shadow-lg transition-shadow border-2">
                  <CardContent className="p-6">
                    <div
                      className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-4`}
                    >
                      <feature.icon className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-muted-foreground">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Additional Highlights */}
        <section className="container mx-auto px-4 py-16">
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                image:
                  "https://images.unsplash.com/photo-1542725752-e9f7259b3881?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlZHVjYXRpb24lMjBsZWFybmluZyUyMGJvb2tzfGVufDF8fHx8MTc1OTg3MDE4OXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
                title: t("highlights.comprehensiveModules.title"),
                description: t("highlights.comprehensiveModules.description"),
              },
              {
                image:
                  "https://images.unsplash.com/photo-1758270704534-fd9715bffc0e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjbGFzc3Jvb20lMjBkaWdpdGFsJTIwdGVjaG5vbG9neXxlbnwxfHx8fDE3NTk5MjE2NzJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
                title: t("highlights.modernTechnology.title"),
                description: t("highlights.modernTechnology.description"),
              },
              {
                image:
                  "https://images.unsplash.com/photo-1528249072419-472a928b71c9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBzY2hvb2wlMjBzdHVkZW50cyUyMHRlY2hub2xvZ3l8ZW58MXx8fHwxNzU5OTIxNjcxfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
                title: t("highlights.userCentricDesign.title"),
                description: t("highlights.userCentricDesign.description"),
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="group cursor-pointer"
              >
                <div className="relative rounded-xl overflow-hidden mb-4 border-2 border-border">
                  <ImageWithFallback
                    src={item.image}
                    alt={item.title}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                <p className="text-muted-foreground">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-border/50 bg-secondary/20 backdrop-blur-sm mt-16">
          <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
                  <GraduationCap className="h-5 w-5 text-white" />
                </div>
                <span className="font-semibold">ScholaXpert</span>
              </div>
              <p className="text-sm text-muted-foreground">
                {t("footer.copyright")}
              </p>
              <div className="flex gap-4 text-sm text-muted-foreground">
                <a href="#" className="hover:text-primary transition-colors">
                  {t("footer.privacy")}
                </a>
                <a href="#" className="hover:text-primary transition-colors">
                  {t("footer.terms")}
                </a>
                <a href="#" className="hover:text-primary transition-colors">
                  {t("footer.contact")}
                </a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
