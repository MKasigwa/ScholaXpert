"use client";

import { useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import {
  useMyAccessRequests,
  useCancelAccessRequest,
  useUpdateAccessRequest,
} from "@/hooks/useTenantAccess";
import {
  AccessRequest,
  AccessRequestStatus,
} from "@/lib/types/tenant-access-types";
import { UserRole } from "@/lib/types/auth-types";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { ThemeSwitcher } from "@/components/ThemeSwitcher";
import {
  Clock,
  Building2,
  Mail,
  User,
  ShieldCheck,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Edit2,
  LogOut,
  Loader2,
  RefreshCcw,
} from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export function AccessRequestWaitingPage() {
  const router = useRouter();
  const t = useTranslations("AccessRequestWaiting");
  const { data: session, update: updateSession } = useSession();
  const { requests, isLoading, refetch } = useMyAccessRequests();
  const { cancelRequest, isLoading: isCancelling } = useCancelAccessRequest();

  const [selectedRequest, setSelectedRequest] = useState<AccessRequest | null>(
    null
  );
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    requestedRole: "" as UserRole,
    message: "",
  });

  // Call useUpdateAccessRequest at component level, not inside event handler
  const { updateRequest, isLoading: isUpdating } = useUpdateAccessRequest(
    selectedRequest?.id || ""
  );

  // Get pending request
  const pendingRequest = requests.find(
    (req) =>
      req.status === AccessRequestStatus.PENDING || req.status === "pending"
  );

  // Check if user has approved request
  useEffect(() => {
    if (!isLoading && !pendingRequest) {
      const approvedRequest = requests.find(
        (req) =>
          req.status === AccessRequestStatus.APPROVED ||
          req.status === "approved"
      );
      if (approvedRequest) {
        // Update the session to remove pending request and add tenant
        updateSession({
          user: {
            hasPendingRequest: false,
            pendingRequestId: null,
          },
        });

        toast.success(t("toast.approved"));
        router.push("/dashboard");
      }
    }
  }, [isLoading, pendingRequest, requests, router, t, updateSession]);

  // Handle edit request
  const handleEditClick = (request: AccessRequest) => {
    setSelectedRequest(request);
    setEditForm({
      requestedRole: request.requestedRole,
      message: request.message || "",
    });
    setIsEditDialogOpen(true);
  };

  const handleSaveEdit = async () => {
    if (!selectedRequest) return;

    try {
      await updateRequest(editForm);
      toast.success(t("toast.updateSuccess"));
      setIsEditDialogOpen(false);
      refetch();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(error.response?.data?.message || t("toast.updateError"));
    }
  };

  // Handle cancel request
  const handleCancelClick = (request: AccessRequest) => {
    setSelectedRequest(request);
    setIsCancelDialogOpen(true);
  };

  const handleConfirmCancel = async () => {
    if (!selectedRequest) return;

    try {
      await cancelRequest(selectedRequest.id);

      // Update the session to remove pending request info
      await updateSession({
        user: {
          hasPendingRequest: false,
          pendingRequestId: null,
        },
      });

      toast.success(t("toast.cancelSuccess"));
      setIsCancelDialogOpen(false);
      router.push("/auth/workspace");
      router.refresh();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(error.response?.data?.message || t("toast.cancelError"));
    }
  };

  // Handle sign out
  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/auth/sign-in" });
  };

  // Get status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case AccessRequestStatus.PENDING:
      case "pending":
        return (
          <Badge
            variant="outline"
            className="bg-yellow-50 text-yellow-700 border-yellow-200"
          >
            <Clock className="w-3 h-3 mr-1" />
            {t("status.pendingReview")}
          </Badge>
        );
      case AccessRequestStatus.APPROVED:
      case "approved":
        return (
          <Badge
            variant="outline"
            className="bg-green-50 text-green-700 border-green-200"
          >
            <CheckCircle2 className="w-3 h-3 mr-1" />
            {t("status.approved")}
          </Badge>
        );
      case AccessRequestStatus.REJECTED:
      case "rejected":
        return (
          <Badge
            variant="outline"
            className="bg-red-50 text-red-700 border-red-200"
          >
            <XCircle className="w-3 h-3 mr-1" />
            {t("status.rejected")}
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  // Get role display name
  const getRoleDisplayName = (role: string) => {
    const roleKey = role as keyof typeof t;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    // return t(`roles.${"role"}` as any) || role;
    return role;
  };

  // Format date
  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Get user initials
  const getUserInitials = (
    firstName?: string,
    lastName?: string,
    email?: string
  ) => {
    if (firstName && lastName) {
      return `${firstName[0]}${lastName[0]}`.toUpperCase();
    }
    if (email) {
      return email[0].toUpperCase();
    }
    return "U";
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        {/* Language & Theme Switchers - Top Corners */}
        <div className="fixed top-4 right-4 z-50 flex items-center gap-2">
          <LanguageSwitcher />
          <ThemeSwitcher />
        </div>

        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center gap-4">
              <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
              <p className="text-muted-foreground">{t("loading.message")}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!pendingRequest) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
        {/* Language & Theme Switchers - Top Corners */}
        <div className="fixed top-4 right-4 z-50 flex items-center gap-2">
          <LanguageSwitcher />
          <ThemeSwitcher />
        </div>

        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>{t("noPendingRequest.title")}</CardTitle>
            <CardDescription>
              {t("noPendingRequest.description")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-3">
              <Button
                onClick={() => router.push("/auth/workspace/request-access")}
              >
                {t("noPendingRequest.requestAccessButton")}
              </Button>
              <Button variant="outline" onClick={handleSignOut}>
                <LogOut className="w-4 h-4 mr-2" />
                {t("noPendingRequest.signOutButton")}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-12 px-4">
      {/* Language & Theme Switchers - Top Corners */}
      <div className="fixed top-4 right-4 z-50 flex items-center gap-2">
        <LanguageSwitcher />
        <ThemeSwitcher />
      </div>

      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900 mb-4">
            <Clock className="w-8 h-8 text-blue-600 dark:text-blue-400" />
          </div>
          <h1 className="text-3xl">{t("header.title")}</h1>
          <p className="text-muted-foreground">{t("header.description")}</p>
        </div>

        {/* Status Alert */}
        <Alert className="border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950">
          <AlertCircle className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          <AlertDescription className="text-blue-900 dark:text-blue-100">
            {t("statusAlert.message")}
          </AlertDescription>
        </Alert>

        {/* User Profile Card */}
        <Card>
          <CardHeader>
            <CardTitle>{t("profileCard.title")}</CardTitle>
            <CardDescription>{t("profileCard.description")}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-start gap-4">
              <Avatar className="w-16 h-16">
                <AvatarImage src="" />
                <AvatarFallback className="bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-100">
                  {getUserInitials(
                    session?.user?.firstName,
                    session?.user?.lastName,
                    session?.user?.email
                  )}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">
                        {t("profileCard.fullName")}
                      </p>
                      <p className="font-medium">
                        {session?.user?.firstName} {session?.user?.lastName}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">
                        {t("profileCard.email")}
                      </p>
                      <p className="font-medium">{session?.user?.email}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Request Details Card */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>{t("requestDetailsCard.title")}</CardTitle>
                <CardDescription>
                  {t("requestDetailsCard.description")}
                </CardDescription>
              </div>
              {getStatusBadge(pendingRequest.status)}
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Institution Info */}
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="mt-1">
                  <Building2 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground">
                    {t("requestDetailsCard.institution")}
                  </p>
                  <p className="font-semibold text-lg">
                    {pendingRequest.tenant?.name}
                  </p>
                  {pendingRequest.tenant?.code && (
                    <p className="text-sm text-muted-foreground">
                      {t("requestDetailsCard.code")}:{" "}
                      {pendingRequest.tenant.code}
                    </p>
                  )}
                  {pendingRequest.tenant?.type && (
                    <Badge variant="secondary" className="mt-1">
                      {pendingRequest.tenant.type}
                    </Badge>
                  )}
                </div>
              </div>
            </div>

            <Separator />

            {/* Requested Role */}
            <div className="flex items-start gap-3">
              <div className="mt-1">
                <ShieldCheck className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-muted-foreground">
                  {t("requestDetailsCard.requestedRole")}
                </p>
                <p className="font-semibold">
                  {getRoleDisplayName(pendingRequest.requestedRole)}
                </p>
              </div>
            </div>

            {/* Message */}
            {pendingRequest.message && (
              <>
                <Separator />
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">
                    {t("requestDetailsCard.yourMessage")}
                  </p>
                  <div className="bg-muted p-3 rounded-lg">
                    <p className="text-sm">{pendingRequest.message}</p>
                  </div>
                </div>
              </>
            )}

            <Separator />

            {/* Timestamps */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">
                  {t("requestDetailsCard.requestedOn")}
                </p>
                <p className="font-medium">
                  {formatDate(pendingRequest.createdAt)}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">
                  {t("requestDetailsCard.lastUpdated")}
                </p>
                <p className="font-medium">
                  {formatDate(pendingRequest.updatedAt)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <Card>
          <CardHeader>
            <CardTitle>{t("actionsCard.title")}</CardTitle>
            <CardDescription>{t("actionsCard.description")}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <Button
                variant="outline"
                onClick={() => refetch()}
                className="w-full"
              >
                <RefreshCcw className="w-4 h-4 mr-2" />
                {t("actionsCard.refreshStatus")}
              </Button>
              <Button
                variant="outline"
                onClick={() => handleEditClick(pendingRequest)}
                className="w-full"
              >
                <Edit2 className="w-4 h-4 mr-2" />
                {t("actionsCard.modifyRequest")}
              </Button>
              <Button
                variant="outline"
                onClick={() => handleCancelClick(pendingRequest)}
                className="w-full text-red-600 border-red-200 hover:bg-red-50"
              >
                <XCircle className="w-4 h-4 mr-2" />
                {t("actionsCard.cancelRequest")}
              </Button>
            </div>

            <Separator />

            <Button variant="ghost" onClick={handleSignOut} className="w-full">
              <LogOut className="w-4 h-4 mr-2" />
              {t("actionsCard.signOut")}
            </Button>
          </CardContent>
        </Card>

        {/* Help Text */}
        <div className="text-center text-sm text-muted-foreground">
          <p>{t("helpText")}</p>
        </div>
      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("editDialog.title")}</DialogTitle>
            <DialogDescription>{t("editDialog.description")}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="role">{t("editDialog.roleLabel")}</Label>
              <Select
                value={editForm.requestedRole}
                onValueChange={(value) =>
                  setEditForm({ ...editForm, requestedRole: value as UserRole })
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder={t("editDialog.rolePlaceholder")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ADMIN">
                    {t("editDialog.roles.admin")}
                  </SelectItem>
                  <SelectItem value="TEACHER">
                    {t("editDialog.roles.teacher")}
                  </SelectItem>
                  <SelectItem value="STUDENT">
                    {t("editDialog.roles.student")}
                  </SelectItem>
                  <SelectItem value="PARENT">
                    {t("editDialog.roles.parent")}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="message">{t("editDialog.messageLabel")}</Label>
              <Textarea
                id="message"
                placeholder={t("editDialog.messagePlaceholder")}
                value={editForm.message}
                onChange={(e) =>
                  setEditForm({ ...editForm, message: e.target.value })
                }
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsEditDialogOpen(false)}
            >
              {t("editDialog.cancelButton")}
            </Button>
            <Button onClick={handleSaveEdit} disabled={isUpdating}>
              {isUpdating ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  {t("editDialog.saving")}
                </>
              ) : (
                t("editDialog.saveButton")
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Cancel Confirmation Dialog */}
      <Dialog open={isCancelDialogOpen} onOpenChange={setIsCancelDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("cancelDialog.title")}</DialogTitle>
            <DialogDescription>
              {t("cancelDialog.description")}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsCancelDialogOpen(false)}
            >
              {t("cancelDialog.keepButton")}
            </Button>
            <Button
              variant="destructive"
              onClick={handleConfirmCancel}
              disabled={isCancelling}
            >
              {isCancelling ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  {t("cancelDialog.cancelling")}
                </>
              ) : (
                t("cancelDialog.cancelButton")
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
