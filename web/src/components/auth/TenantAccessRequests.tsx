"use client";

import { useTranslations } from "next-intl";
import { Layout } from "@/components/Layout";
import { useParams } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  UserCheck,
  Clock,
  CheckCircle,
  XCircle,
  Mail,
  User,
} from "lucide-react";
import {
  useTenantAccessRequests,
  useReviewAccessRequest,
} from "@/hooks/useTenantAccess";
// import { useAppStore } from "@/store/useAppStore";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useAppStore } from "../../../store/useAppStore";

export default function TenantAccessRequestsPage() {
  const params = useParams();
  const locale = params.locale as string;
  const t = useTranslations("TenantAccessRequests");
  const { selectedTenant } = useAppStore();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [reviewingRequest, setReviewingRequest] = useState<any>(null);
  const [reviewAction, setReviewAction] = useState<
    "approved" | "rejected" | null
  >(null);
  const [reviewNotes, setReviewNotes] = useState("");

  // Fetch access requests for the selected tenant
  const { requests: accessRequests, isLoading } = useTenantAccessRequests(
    selectedTenant?.id,
    {
      status: "pending",
      enabled: !!selectedTenant,
    }
  );

  const { reviewRequest, isLoading: isReviewing } = useReviewAccessRequest();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleReview = (request: any, action: "approved" | "rejected") => {
    setReviewingRequest(request);
    setReviewAction(action);
    setReviewNotes("");
  };

  const handleConfirmReview = async () => {
    if (!reviewingRequest || !reviewAction) return;

    await reviewRequest({
      id: reviewingRequest.id,
      data: {
        status: reviewAction,
        reviewNotes,
      },
    });

    setReviewingRequest(null);
    setReviewAction(null);
    setReviewNotes("");
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <Badge variant="outline" className="gap-1">
            <Clock className="h-3 w-3" /> {t("status.pending")}
          </Badge>
        );
      case "approved":
        return (
          <Badge variant="default" className="gap-1 bg-green-500">
            <CheckCircle className="h-3 w-3" /> {t("status.approved")}
          </Badge>
        );
      case "rejected":
        return (
          <Badge variant="destructive" className="gap-1">
            <XCircle className="h-3 w-3" /> {t("status.rejected")}
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <Layout locale={locale}>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="flex items-center gap-2">
              <UserCheck className="h-8 w-8" />
              {t("title")}
            </h1>
            <p className="text-muted-foreground mt-1">{t("description")}</p>
          </div>
        </div>

        {/* Tenant Selection Notice */}
        {!selectedTenant && (
          <Card>
            <CardContent className="p-6 text-center">
              <p className="text-muted-foreground">{t("selectTenant")}</p>
            </CardContent>
          </Card>
        )}

        {/* Access Requests List */}
        {selectedTenant && (
          <div className="space-y-4">
            {isLoading ? (
              <Card>
                <CardContent className="p-6 text-center">
                  <p className="text-muted-foreground">{t("loading")}</p>
                </CardContent>
              </Card>
            ) : accessRequests.length === 0 ? (
              <Card>
                <CardContent className="p-6 text-center">
                  <UserCheck className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
                  <p className="text-muted-foreground">{t("noRequests")}</p>
                </CardContent>
              </Card>
            ) : (
              accessRequests.map((request) => (
                <Card key={request.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="flex items-center gap-2">
                          <User className="h-5 w-5" />
                          {/* {request.user?.firstName} {request.user?.lastName} */}
                          {request.userFullName}
                        </CardTitle>
                        <CardDescription className="flex items-center gap-2 mt-1">
                          <Mail className="h-4 w-4" />
                          {/* {request.user?.email} */}
                          {request.userEmail}
                        </CardDescription>
                      </div>
                      {getStatusBadge(request.status)}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-xs text-muted-foreground">
                          {t("requestedRole")}
                        </Label>
                        <p className="mt-1 font-medium">
                          {request.requestedRole}
                        </p>
                      </div>
                      <div>
                        <Label className="text-xs text-muted-foreground">
                          {t("requestedOn")}
                        </Label>
                        <p className="mt-1">
                          {new Date(request.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    {request.message && (
                      <div>
                        <Label className="text-xs text-muted-foreground">
                          {t("message")}
                        </Label>
                        <p className="mt-1 text-sm p-3 bg-muted rounded-md">
                          {request.message}
                        </p>
                      </div>
                    )}

                    {request.status === "pending" && (
                      <div className="flex gap-2 pt-2">
                        <Button
                          onClick={() => handleReview(request, "approved")}
                          className="flex-1"
                          variant="default"
                        >
                          <CheckCircle className="h-4 w-4 mr-2" />
                          {t("actions.approve")}
                        </Button>
                        <Button
                          onClick={() => handleReview(request, "rejected")}
                          className="flex-1"
                          variant="destructive"
                        >
                          <XCircle className="h-4 w-4 mr-2" />
                          {t("actions.reject")}
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        )}

        {/* Review Dialog */}
        <Dialog
          open={!!reviewingRequest}
          onOpenChange={() => setReviewingRequest(null)}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {reviewAction === "approved"
                  ? t("dialog.approveTitle")
                  : t("dialog.rejectTitle")}
              </DialogTitle>
              <DialogDescription>
                {reviewAction === "approved"
                  ? t("dialog.approveDescription")
                  : t("dialog.rejectDescription")}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div>
                <Label>{t("dialog.notesLabel")}</Label>
                <Textarea
                  placeholder={t("dialog.notesPlaceholder")}
                  value={reviewNotes}
                  onChange={(e) => setReviewNotes(e.target.value)}
                  rows={4}
                />
              </div>
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setReviewingRequest(null)}
              >
                {t("dialog.cancel")}
              </Button>
              <Button
                onClick={handleConfirmReview}
                disabled={isReviewing}
                variant={
                  reviewAction === "approved" ? "default" : "destructive"
                }
              >
                {isReviewing ? t("dialog.processing") : t("dialog.confirm")}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
}
