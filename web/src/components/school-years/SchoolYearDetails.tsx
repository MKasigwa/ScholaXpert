import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Badge } from "../ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Separator } from "../ui/separator";
import { Button } from "../ui/button";
import {
  Calendar,
  Users,
  BookOpen,
  Clock,
  Star,
  User,
  Edit,
} from "lucide-react";
import { SchoolYear } from "@/lib/types/school-year-types";
import { formatDate, formatDateRange } from "@/lib/utils/common";
import { getStatusColor } from "@/lib/utils/schoolYear";

interface SchoolYearDetailsProps {
  open: boolean;
  onClose: () => void;
  schoolYear: SchoolYear | null;
  relatedData?: {
    classes: number;
    terms: number;
    students: number;
    staff: number;
  };
}

export function SchoolYearDetails({
  open,
  onClose,
  schoolYear,
  relatedData,
}: SchoolYearDetailsProps) {
  if (!schoolYear) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="lg:min-w-2xl max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <Calendar className="h-6 w-6" />
            <div>
              <div className="flex items-center gap-2">
                {schoolYear.name}
                {schoolYear.isDefault && (
                  <Badge
                    variant="secondary"
                    className="bg-yellow-50 text-yellow-700 border-yellow-200"
                  >
                    <Star className="h-3 w-3 mr-1" />
                    Default
                  </Badge>
                )}
                <Badge
                  className={getStatusColor(
                    schoolYear.deletedAt ? "deleted" : schoolYear.status
                  )}
                >
                  {schoolYear.deletedAt
                    ? "Deleted"
                    : schoolYear.status.charAt(0).toUpperCase() +
                      schoolYear.status.slice(1)}
                </Badge>
              </div>
              <div className="text-sm text-muted-foreground font-normal">
                Code: {schoolYear.code}
              </div>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <Calendar className="h-8 w-8 mx-auto text-blue-600 mb-2" />
                <div className="text-sm text-muted-foreground">Duration</div>
                <div className="text-lg font-bold">
                  {Math.round(
                    (new Date(schoolYear.endDate).getTime() -
                      new Date(schoolYear.startDate).getTime()) /
                      (1000 * 60 * 60 * 24)
                  )}{" "}
                  days
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 text-center">
                <BookOpen className="h-8 w-8 mx-auto text-green-600 mb-2" />
                <div className="text-sm text-muted-foreground">Classes</div>
                <div className="text-lg font-bold">
                  {relatedData?.classes || 0}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 text-center">
                <Users className="h-8 w-8 mx-auto text-purple-600 mb-2" />
                <div className="text-sm text-muted-foreground">Students</div>
                <div className="text-lg font-bold">
                  {relatedData?.students || 0}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 text-center">
                <User className="h-8 w-8 mx-auto text-orange-600 mb-2" />
                <div className="text-sm text-muted-foreground">Staff</div>
                <div className="text-lg font-bold">
                  {relatedData?.staff || 0}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      School Year Name
                    </label>
                    <div className="text-base font-medium">
                      {schoolYear.name}
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      School Year Code
                    </label>
                    <div className="text-base">
                      <code className="bg-muted px-2 py-1 rounded text-sm">
                        {schoolYear.code}
                      </code>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Status
                    </label>
                    <div className="mt-1">
                      <Badge
                        className={getStatusColor(
                          schoolYear.deletedAt ? "deleted" : schoolYear.status
                        )}
                      >
                        {schoolYear.deletedAt
                          ? "Deleted"
                          : schoolYear.status.charAt(0).toUpperCase() +
                            schoolYear.status.slice(1)}
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Academic Period
                    </label>
                    <div className="text-base font-medium">
                      {formatDateRange(
                        schoolYear.startDate,
                        schoolYear.endDate
                      )}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {formatDate(schoolYear.startDate)} to{" "}
                      {formatDate(schoolYear.endDate)}
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Default Year
                    </label>
                    <div className="mt-1">
                      {schoolYear.isDefault ? (
                        <Badge
                          variant="secondary"
                          className="bg-yellow-50 text-yellow-700 border-yellow-200"
                        >
                          <Star className="h-3 w-3 mr-1" />
                          Yes, this is the default year
                        </Badge>
                      ) : (
                        <span className="text-muted-foreground">No</span>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      School ID
                    </label>
                    <div className="text-base">
                      <code className="bg-muted px-2 py-1 rounded text-sm">
                        {schoolYear.tenantId}
                      </code>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Timeline Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Timeline & Duration
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Visual Timeline */}
                <div className="relative">
                  <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-green-50 dark:from-blue-900 dark:to-green-900 rounded-lg border">
                    <div className="text-center">
                      <div className="text-sm font-medium text-blue-700 dark:text-blue-300">
                        Start Date
                      </div>
                      <div className="text-lg font-bold">
                        {formatDate(schoolYear.startDate)}
                      </div>
                    </div>
                    <div className="flex-1 mx-4">
                      <div className="h-2 bg-gradient-to-r from-blue-400 to-green-400 rounded-full"></div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm font-medium text-green-700 dark:text-gray-300">
                        End Date
                      </div>
                      <div className="text-lg font-bold">
                        {formatDate(schoolYear.endDate)}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Duration Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-3 bg-muted rounded-lg">
                    <div className="text-2xl font-bold">
                      {Math.round(
                        (new Date(schoolYear.endDate).getTime() -
                          new Date(schoolYear.startDate).getTime()) /
                          (1000 * 60 * 60 * 24)
                      )}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Total Days
                    </div>
                  </div>

                  <div className="text-center p-3 bg-muted rounded-lg">
                    <div className="text-2xl font-bold">
                      {Math.round(
                        (new Date(schoolYear.endDate).getTime() -
                          new Date(schoolYear.startDate).getTime()) /
                          (1000 * 60 * 60 * 24 * 7)
                      )}
                    </div>
                    <div className="text-sm text-muted-foreground">Weeks</div>
                  </div>

                  <div className="text-center p-3 bg-muted rounded-lg">
                    <div className="text-2xl font-bold">
                      {Math.round(
                        (new Date(schoolYear.endDate).getTime() -
                          new Date(schoolYear.startDate).getTime()) /
                          (1000 * 60 * 60 * 24 * 30)
                      )}
                    </div>
                    <div className="text-sm text-muted-foreground">Months</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Audit Information */}
          <Card>
            <CardHeader>
              <CardTitle>Audit Trail</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Creation Info */}
                  <div className="space-y-3">
                    <h4 className="text-sm font-medium text-green-700">
                      Created
                    </h4>
                    <div className="space-y-2">
                      <div>
                        <span className="text-sm text-muted-foreground">
                          Date & Time:
                        </span>
                        <div className="font-medium">
                          {new Date(schoolYear.createdAt).toLocaleString()}
                        </div>
                      </div>
                      <div>
                        <span className="text-sm text-muted-foreground">
                          Created By:
                        </span>
                        <div className="font-medium">
                          {schoolYear.createdBy}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Update Info */}
                  <div className="space-y-3">
                    <h4 className="text-sm font-medium text-blue-700">
                      Last Updated
                    </h4>
                    <div className="space-y-2">
                      <div>
                        <span className="text-sm text-muted-foreground">
                          Date & Time:
                        </span>
                        <div className="font-medium">
                          {new Date(schoolYear.updatedAt).toLocaleString()}
                        </div>
                      </div>
                      <div>
                        <span className="text-sm text-muted-foreground">
                          Updated By:
                        </span>
                        <div className="font-medium">
                          {schoolYear.updatedBy}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Deletion Info */}
                {schoolYear.deletedAt && (
                  <>
                    <Separator />
                    <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                      <h4 className="text-sm font-medium text-red-700 mb-3">
                        Deletion Information
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <span className="text-sm text-red-600">
                            Deleted Date & Time:
                          </span>
                          <div className="font-medium text-red-800">
                            {new Date(schoolYear.deletedAt).toLocaleString()}
                          </div>
                        </div>
                        <div>
                          <span className="text-sm text-red-600">
                            Deleted By:
                          </span>
                          <div className="font-medium text-red-800">
                            {schoolYear.deletedBy}
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Related Data (if available) */}
          {relatedData && (
            <Card>
              <CardHeader>
                <CardTitle>Related Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-3 border rounded-lg">
                    <BookOpen className="h-6 w-6 mx-auto text-blue-600 mb-2" />
                    <div className="text-lg font-bold">
                      {relatedData.classes}
                    </div>
                    <div className="text-sm text-muted-foreground">Classes</div>
                  </div>

                  <div className="text-center p-3 border rounded-lg">
                    <Calendar className="h-6 w-6 mx-auto text-green-600 mb-2" />
                    <div className="text-lg font-bold">{relatedData.terms}</div>
                    <div className="text-sm text-muted-foreground">Terms</div>
                  </div>

                  <div className="text-center p-3 border rounded-lg">
                    <Users className="h-6 w-6 mx-auto text-purple-600 mb-2" />
                    <div className="text-lg font-bold">
                      {relatedData.students}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Students
                    </div>
                  </div>

                  <div className="text-center p-3 border rounded-lg">
                    <User className="h-6 w-6 mx-auto text-orange-600 mb-2" />
                    <div className="text-lg font-bold">{relatedData.staff}</div>
                    <div className="text-sm text-muted-foreground">Staff</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
            <Button
              onClick={() => {
                // Handle edit action
                onClose();
              }}
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit School Year
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
