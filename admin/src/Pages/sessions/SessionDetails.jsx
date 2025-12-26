"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { format } from "date-fns";
import {
  CalendarIcon,
  Clock,
  User,
  MapPin,
  Phone,
  Mail,
  CreditCard,
  FileText,
  Star,
  Edit,
  Plus,
  Activity,
  Stethoscope,
  Building2,
  CalendarCheck,
  AlertCircle,
  CheckCircle,
  XCircle,
  Timer,
  Download,
  Eye,
  Loader2,
  AlertTriangle,
  RefreshCw,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useSessionBookings } from "@/hooks/sessions";
import { API_URL } from "@/constant/Urls";
import { useParams } from "react-router-dom";
import axios from "axios";

// Constants
const statusOptionsSession = [
  "Pending",
  "Confirmed",
  "Cancelled",
  "Completed",
  "Rescheduled",
  "No-Show",
];

const prescriptionTypes = [
  "Pre-Treatment",
  "Post-Treatment",
  "Follow-up",
  "Emergency",
];

const statusConfig = {
  Pending: {
    color: "bg-yellow-100 text-yellow-800 border-yellow-200",
    icon: Timer,
  },
  Confirmed: {
    color: "bg-blue-100 text-blue-800 border-blue-200",
    icon: CheckCircle,
  },
  Cancelled: { color: "bg-red-100 text-red-800 border-red-200", icon: XCircle },
  Completed: {
    color: "bg-green-100 text-green-800 border-green-200",
    icon: CheckCircle,
  },
  Rescheduled: {
    color: "bg-purple-100 text-purple-800 border-purple-200",
    icon: CalendarCheck,
  },
  "No-Show": {
    color: "bg-gray-100 text-gray-800 border-gray-200",
    icon: AlertCircle,
  },
};

const SessionDetails = () => {
  const { id } = useParams();
  const {
    singleSession,
    loading: sessionLoading,
    fetchSingleSessionDetails: refetch,
  } = useSessionBookings({ id });

  // Loading and Error States
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Dialog states
  const [statusUpdateDialog, setStatusUpdateDialog] = useState(false);
  const [rescheduleDialog, setRescheduleDialog] = useState(false);
  const [nextSessionDialog, setNextSessionDialog] = useState(false);
  const [prescriptionDialog, setPrescriptionDialog] = useState(false);
  const [cancelReasonDialog, setCancelReasonDialog] = useState(false);

  // Form states
  const [selectedStatus, setSelectedStatus] = useState("");
  const [cancelReason, setCancelReason] = useState("");
  const [rescheduleDate, setRescheduleDate] = useState();
  const [rescheduleTime, setRescheduleTime] = useState("");
  const [rescheduleSessionId, setRescheduleSessionId] = useState("");
  const [nextDate, setNextDate] = useState();
  const [nextTime, setNextTime] = useState("");
  const [prescriptionType, setPrescriptionType] = useState("");
  const [selectedSessionNumber, setSelectedSessionNumber] = useState(1);
  const [prescriptionFile, setPrescriptionFile] = useState(null);

  // Auto-clear messages
  useEffect(() => {
    if (error || success) {
      const timer = setTimeout(() => {
        setError("");
        setSuccess("");
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, success]);

  // Loading wrapper for API calls
  const withLoading = async (asyncFn, successMessage = "") => {
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      await asyncFn();
      if (successMessage) {
        setSuccess(successMessage);
      }
      await refetch();
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || err.message || "An error occurred";
      setError(errorMessage);
      console.error("API Error:", err);
    } finally {
      setLoading(false);
    }
  };

  // Main session status update function
  const mainSessionStatusUpdate = async (status, reason = "") => {
    if (status === "Cancelled" && !reason.trim()) {
      setCancelReasonDialog(true);
      return;
    }

    await withLoading(async () => {
      const response = await axios.post(
        `${API_URL}/admin-main-session-status-update`,
        {
          sessionId: id,
          status,
          reason: reason.trim(),
        }
      );

      setStatusUpdateDialog(false);
      setSelectedStatus("");
      setCancelReason("");
      setCancelReasonDialog(false);
    }, `Session status updated to ${status} successfully`);
  };

  // Update individual session status
  const updateSessionStatus = async ({
    sessionNumber,
    status,
    reason = "",
  }) => {
    await withLoading(async () => {
      const response = await axios.post(`${API_URL}/admin-changes-sessions`, {
        _id: id,
        sessionNumber,
        status,
        reason: reason.trim(),
      });
    }, `Session updated successfully`);
  };

  // Reschedule session
  // const handleRescheduleSession = async () => {
  //   if (!rescheduleDate || !rescheduleTime || !rescheduleSessionId) {
  //     setError("Please select date, time and session to reschedule")
  //     return
  //   }

  //   await withLoading(async () => {
  //     const response = await axios.post(`${API_URL}/admin-changes-sessions`, {
  //       _id: rescheduleSessionId,
  //       new_date: format(rescheduleDate, "yyyy-MM-dd"),
  //       new_time: rescheduleTime,
  //       status: "Rescheduled",
  //       isReschedule: true,
  //     })

  //     setRescheduleDialog(false)
  //     setRescheduleDate(undefined)
  //     setRescheduleTime("")
  //     setRescheduleSessionId("")
  //   }, "Session rescheduled successfully")
  // }

  // New Code

  const handleRescheduleSession = async () => {
    if (!rescheduleDate || !rescheduleTime || !rescheduleSessionId) {
      setError("Please select date, time and session to reschedule");
      return;
    }

    // Find the selected session from your singleSession data
    const sessionToReschedule = singleSession?.SessionDates?.find(
      (s) => s._id === rescheduleSessionId
    );

    if (!sessionToReschedule) {
      setError("Invalid session selected");
      return;
    }

    await withLoading(async () => {
      await axios.post(`${API_URL}/admin-changes-sessions`, {
        _id: id, // booking id
        sessionNumber: sessionToReschedule.sessionNumber, // send sessionNumber
        new_date: format(rescheduleDate, "yyyy-MM-dd"),
        new_time: rescheduleTime,
        status: "Rescheduled",
        isReschedule: true,
      });

      setRescheduleDialog(false);
      setRescheduleDate(undefined);
      setRescheduleTime("");
      setRescheduleSessionId("");
    }, "Session rescheduled successfully");
  };

  // Add next session (only if first session is completed)
  const handleAddNextSession = async () => {
    if (!nextDate || !nextTime) {
      setError("Please select date and time for next session");
      return;
    }

    // Check if first session is completed
    const firstSession = singleSession?.SessionDates?.find(
      (s) => s.sessionNumber === 1
    );
    if (!firstSession || firstSession.status !== "Completed") {
      setError(
        "Next session can only be added after the first session is completed"
      );
      return;
    }

    await withLoading(async () => {
      const response = await axios.post(`${API_URL}/admin-add-next-sessions`, {
        bookingId: singleSession?._id,
        new_date: format(nextDate, "yyyy-MM-dd"),
        new_time: nextTime,
      });

      setNextSessionDialog(false);
      setNextDate(undefined);
      setNextTime("");
    }, "Next session added successfully");
  };

  // Add/Update prescription
  const handleAddPrescription = async () => {
    if (!prescriptionType) {
      setError("Please select prescription type");
      return;
    }

    await withLoading(async () => {
      const formData = new FormData();
      formData.append("_id", id || "");
      formData.append("prescriptionType", prescriptionType);
      formData.append("sessionNumber", selectedSessionNumber.toString());
      if (prescriptionFile) {
        formData.append("image", prescriptionFile);
      }

      const response = await axios.post(
        `${API_URL}/admin-add-updated-prescriptions`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setPrescriptionDialog(false);
      setPrescriptionType("");
      setSelectedSessionNumber(1);
      setPrescriptionFile(null);
    }, "Prescription added successfully");
  };

  const getStatusBadge = (status) => {
    const config = statusConfig[status] || statusConfig.Pending;
    const IconComponent = config.icon;

    return (
      <Badge
        className={cn(
          "flex items-center gap-1 text-xs font-medium border",
          config.color
        )}
      >
        <IconComponent className="w-3 h-3" />
        {status}
      </Badge>
    );
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(amount);
  };

  // Loading component
  const LoadingSpinner = ({ message = "Loading..." }) => (
    <div className="flex flex-col items-center justify-center p-8 space-y-4">
      <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      <p className="text-gray-600">{message}</p>
    </div>
  );

  // Error component
  const ErrorDisplay = ({ message, onRetry }) => (
    <div className="flex flex-col items-center justify-center p-8 space-y-4">
      <AlertTriangle className="w-12 h-12 text-red-500" />
      <p className="text-red-600 text-center">{message}</p>
      {onRetry && (
        <Button onClick={onRetry} variant="outline">
          <RefreshCw className="w-4 h-4 mr-2" />
          Retry
        </Button>
      )}
    </div>
  );

  if (!id) {
    return <ErrorDisplay message="Session ID not found" />;
  }

  if (sessionLoading) {
    return <LoadingSpinner message="Loading session details..." />;
  }

  if (!singleSession) {
    return <ErrorDisplay message="Session not found" onRetry={refetch} />;
  }

  const canAddNextSession = singleSession?.SessionDates?.some(
    (s) => s.sessionNumber === 1 && s.status === "Completed"
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Loading Overlay */}
        {loading && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <LoadingSpinner message="Processing request..." />
            </div>
          </div>
        )}

        {/* Alert Messages */}
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert className="border-green-200 bg-green-50">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              {success}
            </AlertDescription>
          </Alert>
        )}

        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
          <div className="bg-gradient-to-r from-blue-800 to-sky-700 p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold">Session Management</h1>
                <p className="text-blue-100 mt-1">
                  Booking #{singleSession?.bookingNumber}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div className="bg-red-200 px-3 py-1 rounded text-red-800 text-sm font-semibold shadow-sm">
                  {singleSession?.priority} Priority
                </div>
                <div className="bg-blue-200 px-3 py-1 rounded text-blue-800 text-sm font-semibold shadow-sm">
                  Source: {singleSession?.bookingSource}
                </div>
              </div>
            </div>
          </div>

          <div className="p-6 bg-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                {getStatusBadge(singleSession?.session_status)}
                <Separator orientation="vertical" className="h-6" />
                <div className="text-sm text-gray-600">
                  Created:{" "}
                  {singleSession?.createdAt &&
                    format(new Date(singleSession?.createdAt), "PPP")}
                </div>
              </div>
              <div className="flex gap-2">
                <Dialog
                  open={statusUpdateDialog}
                  onOpenChange={setStatusUpdateDialog}
                >
                  <DialogTrigger asChild>
                    <Button
                      size="sm"
                      disabled={loading}
                      className="bg-[#14B8A6] text-white hover:bg-[#0F766E] focus:ring-4 focus:ring-[#14B8A6]/50 font-medium rounded text-sm px-4 py-2.5 transition flex items-center"
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      Update Status
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Update Main Session Status</DialogTitle>
                      <DialogDescription>
                        Change the overall status of this session booking.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="status">New Status</Label>
                        <Select
                          value={selectedStatus}
                          onValueChange={setSelectedStatus}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                          <SelectContent>
                            {statusOptionsSession.map((status) => (
                              <SelectItem key={status} value={status}>
                                {status}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button
                        variant="outline"
                        onClick={() => setStatusUpdateDialog(false)}
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={() => mainSessionStatusUpdate(selectedStatus)}
                        disabled={!selectedStatus || loading}
                      >
                        {loading && (
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        )}
                        Update Status
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>

                <Dialog
                  open={nextSessionDialog}
                  onOpenChange={setNextSessionDialog}
                >
                  <DialogTrigger asChild>
                    <Button
                      size="sm"
                      disabled={!canAddNextSession || loading}
                      className="text-white bg-[#FF9119] hover:bg-[#FF9119]/80 focus:ring-4 focus:outline-none focus:ring-[#FF9119]/50 font-medium rounded text-sm px-5 py-2.5 transition"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Next Session
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add Next Session</DialogTitle>
                      <DialogDescription>
                        Schedule the next session for this patient.
                        {!canAddNextSession && (
                          <span className="text-red-600 block mt-2">
                            First session must be completed before adding next
                            session.
                          </span>
                        )}
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label>Select Date</Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className={cn(
                                "w-full justify-start text-left font-normal",
                                !nextDate && "text-muted-foreground"
                              )}
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {nextDate
                                ? format(nextDate, "PPP")
                                : "Pick a date"}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0">
                            <Calendar
                              mode="single"
                              selected={nextDate}
                              onSelect={setNextDate}
                              initialFocus
                              disabled={(date) => date < new Date()}
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                      <div>
                        <Label htmlFor="time">Time</Label>
                        <Input
                          id="time"
                          type="time"
                          value={nextTime}
                          onChange={(e) => setNextTime(e.target.value)}
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button
                        variant="outline"
                        onClick={() => setNextSessionDialog(false)}
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={handleAddNextSession}
                        disabled={!nextDate || !nextTime || loading}
                      >
                        {loading && (
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        )}
                        Add Session
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </div>
        </div>

        {/* Cancel Reason Dialog */}
        <Dialog open={cancelReasonDialog} onOpenChange={setCancelReasonDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Cancellation Reason</DialogTitle>
              <DialogDescription>
                Please provide a reason for cancelling this session.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="cancelReason">Reason for Cancellation</Label>
                <Textarea
                  id="cancelReason"
                  placeholder="Enter reason for cancellation..."
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  required
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setCancelReasonDialog(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={() =>
                  mainSessionStatusUpdate("Cancelled", cancelReason)
                }
                disabled={!cancelReason.trim() || loading}
                variant="destructive"
              >
                {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                Confirm Cancellation
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Reschedule Dialog */}
        <Dialog open={rescheduleDialog} onOpenChange={setRescheduleDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Reschedule Session</DialogTitle>
              <DialogDescription>
                Select a new date and time for the session.
              </DialogDescription>
            </DialogHeader>
           <div className="space-y-6 p-4 bg-white rounded-lg shadow-sm border border-gray-200">
  {/* Select Session */}
  <div className="space-y-1">
    <Label className="font-medium text-gray-700">Select Session</Label>
    <Select
      value={rescheduleSessionId}
      onValueChange={setRescheduleSessionId}
    >
      <SelectTrigger className="w-full border-gray-300 focus:ring-2 focus:ring-blue-400 rounded-md">
        <SelectValue placeholder="Select session to reschedule" />
      </SelectTrigger>
      <SelectContent>
        {singleSession?.SessionDates?.filter(
          (s) => s.status === "Pending" || s.status === "Confirmed"
        ).map((session) => (
          <SelectItem key={session._id} value={session._id}>
            Session {session.sessionNumber} -{" "}
            {format(new Date(session.date), "PPP")}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  </div>

  {/* New Date */}
  <div className="space-y-1">
    <Label className="font-medium text-gray-700">New Date</Label>
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full justify-start text-left font-normal rounded-md border-gray-300 hover:bg-gray-50 focus:ring-2 focus:ring-blue-400 transition",
            !rescheduleDate && "text-gray-400"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {rescheduleDate ? format(rescheduleDate, "PPP") : "Pick a date"}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={rescheduleDate}
          onSelect={setRescheduleDate}
          initialFocus
          disabled={(date) => date < new Date()}
        />
      </PopoverContent>
    </Popover>
  </div>

  {/* New Time */}
  <div className="space-y-1">
    <Label htmlFor="rescheduleTime" className="font-medium text-gray-700">
      New Time
    </Label>
    <Input
      id="rescheduleTime"
      type="time"
      value={rescheduleTime}
      onChange={(e) => setRescheduleTime(e.target.value)}
      className="w-full border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400"
    />
  </div>
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setRescheduleDialog(false)}
              >
                Cancel
              </Button>
              <Button
                  onClick={handleRescheduleSession}
                  disabled={
                    !rescheduleDate ||
                    !rescheduleTime ||
                    !rescheduleSessionId ||
                    loading
                  }
                  className="bg-gradient-to-r from-blue-800 to-sky-700 text-white hover:from-blue-900 hover:to-sky-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg px-4 py-2 flex items-center justify-center transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  Reschedule
                </Button>

            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Main Content */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="flex w-full rounded-xl overflow-hidden shadow-md">
            <TabsTrigger
              value="overview"
              className="flex-1 text-center py-3 text-sm font-semibold text-gray-700 hover:bg-blue-100 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-sky-500 data-[state=active]:text-white transition-all"
            >
              Overview
            </TabsTrigger>

            <TabsTrigger
              value="patient"
              className="flex-1 text-center py-3 text-sm font-semibold text-gray-700 hover:bg-green-100 data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-teal-400 data-[state=active]:text-white transition-all"
            >
              Patient
            </TabsTrigger>

            <TabsTrigger
              value="treatment"
              className="flex-1 text-center py-3 text-sm font-semibold text-gray-700 hover:bg-purple-100 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-pink-500 data-[state=active]:text-white transition-all"
            >
              Treatment
            </TabsTrigger>

            <TabsTrigger
              value="sessions"
              className="flex-1 text-center py-3 text-sm font-semibold text-gray-700 hover:bg-yellow-100 data-[state=active]:bg-gradient-to-r data-[state=active]:from-yellow-500 data-[state=active]:to-orange-400 data-[state=active]:text-white transition-all"
            >
              Sessions
            </TabsTrigger>

            <TabsTrigger
              value="prescriptions"
              className="flex-1 text-center py-3 text-sm font-semibold text-gray-700 hover:bg-pink-100 data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-500 data-[state=active]:to-red-400 data-[state=active]:text-white transition-all"
            >
              Prescriptions
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Total Sessions */}
              <Card className="bg-gradient-to-tr from-blue-100 to-blue-50 text-blue-900 shadow-lg rounded-xl">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <Activity className="h-10 w-10 text-blue-600" />
                    <div>
                      <p className="text-sm font-medium">Total Sessions</p>
                      <p className="text-2xl font-bold">
                        {singleSession?.no_of_session_book}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Completed */}
              <Card className="bg-gradient-to-tr from-green-100 to-green-50 text-green-900 shadow-lg rounded-xl">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <CheckCircle className="h-10 w-10 text-green-600" />
                    <div>
                      <p className="text-sm font-medium">Completed</p>
                      <p className="text-2xl font-bold">
                        {singleSession?.completedSessionsCount}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Total Amount */}
              <Card className="bg-gradient-to-tr from-purple-100 to-purple-50 text-purple-900 shadow-lg rounded-xl">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <CreditCard className="h-10 w-10 text-purple-600" />
                    <div>
                      <p className="text-sm font-medium">Total Amount</p>
                      <p className="text-2xl font-bold">
                        {formatCurrency(singleSession?.totalAmount)}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Progress */}
              <Card className="bg-gradient-to-tr from-orange-100 to-orange-50 text-orange-900 shadow-lg rounded-xl">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <Timer className="h-10 w-10 text-orange-600" />
                    <div>
                      <p className="text-sm font-medium">Progress</p>
                      <p className="text-2xl font-bold">
                        {singleSession?.progressPercentage}%
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Progress Bar */}
            <Card className="shadow-lg rounded-xl overflow-hidden hover:shadow-xl transition-shadow duration-300">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-bold text-gray-800">
                  Treatment Progress
                </CardTitle>
                <CardDescription className="text-gray-500 text-sm">
                  Overall session completion status
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="space-y-3">
                  {/* Progress Info */}
                  <div className="flex justify-between text-sm font-medium text-gray-700">
                    <span>Progress</span>
                    <span>{singleSession?.progressPercentage}%</span>
                  </div>

                  {/* Progress Bar */}
                  <div className="relative w-full bg-gray-200 rounded-full h-5 overflow-hidden">
                    <div
                      className="absolute left-0 top-0 h-5 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-end pr-2 text-white text-xs font-semibold transition-all duration-500"
                      style={{ width: `${singleSession?.progressPercentage}%` }}
                    >
                      {singleSession?.progressPercentage}%
                    </div>
                  </div>

                  {/* Completed vs Remaining */}
                  <div className="flex justify-between text-sm text-gray-500 mt-1">
                    <span>
                      {singleSession?.completedSessionsCount} completed
                    </span>
                    <span>
                      {singleSession?.no_of_session_book -
                        singleSession?.completedSessionsCount}{" "}
                      remaining
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="patient" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-white shadow-md rounded-xl hover:shadow-xl transition-shadow duration-300 overflow-hidden">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2 text-lg font-semibold text-gray-800">
                    <User className="w-5 h-5 text-blue-600" />
                    Patient Information
                  </CardTitle>
                </CardHeader>

                <CardContent className="space-y-6">
                  {/* Profile Section */}
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-400 to-purple-600 flex items-center justify-center overflow-hidden">
                      {singleSession?.session_booking_user?.profileImage
                        ?.url ? (
                        <img
                          src={
                            singleSession?.session_booking_user?.profileImage
                              .url
                          }
                          alt="Profile"
                          className="w-16 h-16 rounded-full object-cover"
                        />
                      ) : (
                        <User className="w-8 h-8 text-white" />
                      )}
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900">
                        {singleSession?.patient_details?.name}
                      </h3>
                      <p className="text-gray-500 capitalize">
                        {singleSession?.session_booking_user?.role}
                      </p>
                      <Badge className="mt-1 bg-green-600 text-white px-2 py-1 rounded text-xs">
                        {singleSession?.session_booking_user?.status}
                      </Badge>
                    </div>
                  </div>

                  <Separator />

                  {/* Contact Section */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <Mail className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-500">Email</p>
                        <p className="text-gray-800 font-medium">
                          {singleSession?.patient_details?.email}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Phone className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-500">Phone</p>
                        <p className="text-gray-800 font-medium">
                          {singleSession?.patient_details?.phone}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-green-600" />
                    Payment Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Payment Method</p>
                      <p className="font-medium capitalize">
                        {singleSession?.payment_id?.paymentMethod}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Payment Status</p>
                      <Badge
                        className={`mt-1 px-2 py-1 rounded text-xs ${
                          singleSession?.payment_id?.status === "pending"
                            ? "bg-yellow-500 text-white"
                            : singleSession?.payment_id?.status === "success"
                            ? "bg-green-600 text-white"
                            : "bg-gray-200 text-gray-800"
                        }`}
                      >
                        {singleSession?.payment_id?.status}
                      </Badge>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Subtotal</span>
                      <span>
                        {formatCurrency(
                          Number.parseInt(
                            singleSession?.payment_id?.payment_details
                              ?.subtotal || 0
                          )
                        )}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Tax</span>
                      <span>
                        {formatCurrency(
                          Number.parseInt(
                            singleSession?.payment_id?.payment_details?.tax || 0
                          )
                        )}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Credit Card Fee</span>
                      <span>
                        {formatCurrency(
                          Number.parseInt(
                            singleSession?.payment_id?.payment_details
                              ?.creditCardFee || 0
                          )
                        )}
                      </span>
                    </div>
                    <Separator />
                    <div className="flex justify-between font-bold text-lg">
                      <span>Total</span>
                      <span className="text-green-600">
                        {formatCurrency(singleSession?.payment_id?.amount)}
                      </span>
                    </div>
                  </div>

                  <div className="text-xs text-gray-500">
                    <p>
                      Order ID: {singleSession?.payment_id?.razorpay_order_id}
                    </p>
                    <p>
                      Paid on:{" "}
                      {singleSession?.payment_id?.paidAt &&
                        format(
                          new Date(singleSession?.payment_id?.paidAt),
                          "PPp"
                        )}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="treatment" className="space-y-6">
            <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-gray-800">
                  <Activity className="w-5 h-5 text-green-600" />
                  Treatment Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Treatment Info */}
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold text-2xl text-gray-900">
                        {singleSession?.treatment_id?.service_name}
                      </h3>
                      <p className="text-gray-600 mt-2">
                        {singleSession?.treatment_id?.service_small_desc}
                      </p>
                    </div>

                    <div className="flex items-center gap-4 flex-wrap">
                      <div className="text-2xl font-bold text-green-600">
                        {formatCurrency(
                          singleSession?.treatment_id
                            ?.service_per_session_discount_price
                        )}
                      </div>
                      <div className="text-lg text-gray-400 line-through">
                        {formatCurrency(
                          singleSession?.treatment_id?.service_per_session_price
                        )}
                      </div>
                      <Badge className="bg-red-200 text-red-800 font-semibold px-3 py-1 rounded">
                        {
                          singleSession?.treatment_id
                            ?.service_per_session_discount_percentage
                        }
                        % OFF
                      </Badge>
                    </div>

                    <Badge
                      className={`w-fit px-3 py-1 rounded font-medium ${
                        singleSession?.treatment_id?.service_status ===
                        "Booking Open"
                          ? "bg-green-600 text-white"
                          : "bg-gray-300 text-gray-700"
                      }`}
                    >
                      {singleSession?.treatment_id?.service_status}
                    </Badge>
                  </div>

                  {/* Treatment Images */}
                  <div>
                    {singleSession?.treatment_id?.service_images?.length >
                      0 && (
                      <div className="grid grid-cols-2 gap-3">
                        {singleSession?.treatment_id?.service_images
                          .slice(0, 4)
                          .map((image, index) => (
                            <img
                              key={image._id}
                              src={image.url || "/placeholder.svg"}
                              alt={`Treatment ${index + 1}`}
                              className="w-full h-32 lg:h-40 object-cover rounded-xl shadow-sm hover:scale-105 transition-transform duration-300"
                            />
                          ))}
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Clinic Information Card */}
              <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-gray-800 text-lg font-semibold">
                    <Building2 className="w-5 h-5 text-blue-600" />
                    Clinic Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-5">
                  <div>
                    <h3 className="font-semibold text-xl text-gray-900">
                      {singleSession?.session_booking_for_clinic?.clinic_name}
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                      <Star className="w-4 h-4 text-yellow-500" />
                      <span className="font-medium">
                        {
                          singleSession?.session_booking_for_clinic
                            ?.clinic_ratings
                        }
                      </span>
                    </div>
                  </div>

                  <div className="space-y-4 text-gray-700">
                    <div className="flex items-start gap-3">
                      <MapPin className="w-5 h-5 text-gray-400 mt-1" />
                      <div>
                        <p className="text-sm text-gray-500">Address</p>
                        <p className="text-sm">
                          {
                            singleSession?.session_booking_for_clinic
                              ?.clinic_contact_details?.clinic_address
                          }
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Clock className="w-5 h-5 text-gray-400 mt-1" />
                      <div>
                        <p className="text-sm text-gray-500">Timings</p>
                        <p className="text-sm">
                          {
                            singleSession?.session_booking_for_clinic
                              ?.clinic_timings?.open_time
                          }{" "}
                          -{" "}
                          {
                            singleSession?.session_booking_for_clinic
                              ?.clinic_timings?.close_time
                          }
                        </p>
                        <p className="text-xs text-gray-400">
                          Closed on{" "}
                          {
                            singleSession?.session_booking_for_clinic
                              ?.clinic_timings?.off_day
                          }
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Phone className="w-5 h-5 text-gray-400 mt-1" />
                      <div>
                        <p className="text-sm text-gray-500">Contact</p>
                        {singleSession?.session_booking_for_clinic?.clinic_contact_details?.phone_numbers?.map(
                          (phone, index) => (
                            <p key={index} className="text-sm">
                              {phone}
                            </p>
                          )
                        )}
                      </div>
                    </div>
                  </div>

                  {singleSession?.session_booking_for_clinic
                    ?.any_special_note && (
                    <div className="text-sm text-gray-600 p-3 bg-blue-50 rounded-lg border-l-4 border-blue-300">
                      {
                        singleSession?.session_booking_for_clinic
                          ?.any_special_note
                      }
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Doctor Information Card */}
              <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-gray-800 text-lg font-semibold">
                    <Stethoscope className="w-5 h-5 text-purple-600" />
                    Doctor Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-5">
                  <div>
                    <h3 className="font-semibold text-xl text-gray-900">
                      {singleSession?.session_booking_for_doctor?.doctor_name}
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                      <Star className="w-4 h-4 text-yellow-500" />
                      <span className="font-medium">
                        {
                          singleSession?.session_booking_for_doctor
                            ?.doctor_ratings
                        }
                      </span>
                      <Badge
                        className={`ml-2 px-3 py-1 rounded text-xs font-medium ${
                          singleSession?.session_booking_for_doctor
                            ?.doctor_status === "Active"
                            ? "bg-green-600 text-white"
                            : "bg-gray-300 text-gray-700"
                        }`}
                      >
                        {
                          singleSession?.session_booking_for_doctor
                            ?.doctor_status
                        }
                      </Badge>
                    </div>
                  </div>

                  <div className="space-y-3 text-gray-700">
                    {/* Specializations */}
                    <div>
                      <p className="text-sm text-gray-500 mb-1">
                        Specializations
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {singleSession?.session_booking_for_doctor?.specialization?.map(
                          (spec, index) => (
                            <Badge
                              key={index}
                              variant="outline"
                              className="text-xs px-2 py-1 rounded-full"
                            >
                              {spec}
                            </Badge>
                          )
                        )}
                      </div>
                    </div>

                    {/* Languages */}
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Languages</p>
                      <div className="flex flex-wrap gap-2">
                        {singleSession?.session_booking_for_doctor?.languagesSpoken?.map(
                          (lang, index) => (
                            <Badge
                              key={index}
                              variant="secondary"
                              className="text-xs px-2 py-1 rounded-full"
                            >
                              {lang}
                            </Badge>
                          )
                        )}
                      </div>
                    </div>
                  </div>

                  {singleSession?.session_booking_for_doctor
                    ?.any_special_note && (
                    <div className="text-sm text-gray-600 p-3 bg-purple-50 rounded-lg border-l-4 border-purple-300">
                      {
                        singleSession?.session_booking_for_doctor
                          ?.any_special_note
                      }
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="sessions" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <CalendarCheck className="w-5 h-5 text-purple-600" />
                      Session Timeline
                    </CardTitle>
                    <CardDescription>
                      Track all scheduled sessions and their status
                    </CardDescription>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-[#14B8A6] text-white hover:bg-[#0F766E] hover:text-white focus:ring-4 focus:ring-[#14B8A6]/50 font-medium rounded text-sm px-4 py-2.5 transition flex items-center"
                    onClick={() => setRescheduleDialog(true)}
                    disabled={loading}
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Reschedule
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  {singleSession?.SessionDates?.map((session, index) => (
                    <div
                      key={session._id}
                      className="flex items-center gap-4 p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                          <span className="text-sm font-semibold text-purple-600">
                            {session.sessionNumber}
                          </span>
                        </div>
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="font-medium">
                            Session {session.sessionNumber}
                          </h4>
                          {getStatusBadge(session.status)}
                        </div>
                        <div className="flex items-center gap-6 text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <CalendarIcon className="w-4 h-4" />
                            {format(new Date(session.date), "PPP")}
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {session.time}
                          </div>
                        </div>

                        {/* Show prescriptions for completed sessions */}
                        {session.status === "Completed" && (
                          <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                            <div className="flex items-center gap-2 mb-2">
                              <FileText className="w-4 h-4 text-green-600" />
                              <span className="text-sm font-medium text-green-800">
                                Session Prescriptions
                              </span>
                            </div>
                            {singleSession?.session_prescriptions?.filter(
                              (p) => p.sessionNumber === session.sessionNumber
                            ).length > 0 ? (
                              <div className="space-y-1">
                                {singleSession?.session_prescriptions
                                  ?.filter(
                                    (p) =>
                                      p.sessionNumber === session.sessionNumber
                                  )
                                  ?.map((prescription, pIndex) => (
                                    <div
                                      key={pIndex}
                                      className="flex items-center justify-between text-sm"
                                    >
                                      <span className="text-green-700">
                                        {prescription.prescriptionType}
                                      </span>
                                      <div className="flex gap-1">
                                        <Button
                                          size="sm"
                                          className="bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 shadow-md hover:shadow-lg focus:ring-2 focus:ring-blue-300 rounded px-2 h-6 flex items-center justify-center transition-all duration-300"
                                          onClick={() =>
                                            (window.location.href =
                                              prescription?.url)
                                          }
                                        >
                                          <Eye className="w-3 h-3" />
                                        </Button>

                                        <Button
                                          size="sm"
                                          className="bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700 shadow-md hover:shadow-lg focus:ring-2 focus:ring-green-300 rounded px-2 h-6 flex items-center justify-center transition-all duration-300"
                                          onClick={() =>
                                            fetch(prescription?.url)
                                              .then((res) => res.blob())
                                              .then((blob) => {
                                                const link =
                                                  document.createElement("a");
                                                link.href =
                                                  URL.createObjectURL(blob);
                                                link.download = `Prescription-${prescription?.sessionNumber}.pdf`;
                                                link.click();
                                                URL.revokeObjectURL(link.href); // clean up
                                              })
                                              .catch((err) =>
                                                console.error(
                                                  "Download failed",
                                                  err
                                                )
                                              )
                                          }
                                        >
                                          <Download className="w-3 h-3" />
                                        </Button>
                                      </div>
                                    </div>
                                  ))}
                              </div>
                            ) : (
                              <p className="text-sm text-green-600">
                                No prescriptions added yet
                              </p>
                            )}
                          </div>
                        )}
                      </div>

                      <div className="flex gap-2">
                        {(session.status === "Pending" ||
                          session.status === "Confirmed") && (
                          <>
                            <Button
                              size="sm"
                              className="bg-green-600 text-white hover:bg-green-700 focus:ring-2 focus:ring-green-300 font-medium rounded text-sm px-3 py-2 flex items-center transition"
                              onClick={() =>
                                updateSessionStatus({
                                  sessionNumber: session.sessionNumber,
                                  status: "Completed",
                                })
                              }
                              disabled={loading}
                            >
                              <CheckCircle className="w-4 h-4 mr-2" />
                              Complete
                            </Button>

                            <Button
                              size="sm"
                              className="bg-yellow-500 text-white hover:bg-yellow-600 focus:ring-2 focus:ring-yellow-300 font-medium rounded text-sm px-3 py-2 flex items-center transition"
                              onClick={() =>
                                updateSessionStatus({
                                  sessionNumber: session.sessionNumber,
                                  status: "Cancelled",
                                })
                              }
                              disabled={loading}
                            >
                              <XCircle className="w-4 h-4 mr-2" />
                              Cancelled
                            </Button>

                            <Button
                              size="sm"
                              className="bg-red-600 text-white hover:bg-red-700 focus:ring-2 focus:ring-red-300 font-medium rounded text-sm px-3 py-2 flex items-center transition"
                              onClick={() =>
                                updateSessionStatus({
                                  sessionNumber: session.sessionNumber,
                                  status: "No-Show",
                                })
                              }
                              disabled={loading}
                            >
                              <XCircle className="w-4 h-4 mr-2" />
                              No-Show
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {singleSession?.nextSession && (
                  <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <h4 className="font-medium text-blue-900 mb-2">
                      Next Session
                    </h4>
                    <div className="flex items-center gap-6 text-sm text-blue-700">
                      <div className="flex items-center gap-1">
                        <CalendarIcon className="w-4 h-4" />
                        {format(
                          new Date(singleSession?.nextSession.date),
                          "PPP"
                        )}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {singleSession?.nextSession.time}
                      </div>
                      {getStatusBadge(singleSession?.nextSession.status)}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="prescriptions" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-green-600" />
                  Session Prescriptions
                </CardTitle>
                <CardDescription>
                  Manage prescriptions for each session
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center mb-4">
                  <p className="text-sm text-gray-600">
                    {singleSession?.session_prescriptions?.length || 0}{" "}
                    prescription(s) available
                  </p>
                  <Dialog
                    open={prescriptionDialog}
                    onOpenChange={setPrescriptionDialog}
                  >
                    <DialogTrigger asChild>
                      <Button
                        size="sm"
                        disabled={loading}
                        className="bg-[#14B8A6] text-white hover:bg-[#0F766E] hover:text-white focus:ring-4 focus:ring-[#14B8A6]/50 font-medium rounded text-sm px-4 py-2.5 transition flex items-center"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Add Prescription
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Add Prescription</DialogTitle>
                        <DialogDescription>
                          Upload a prescription for a specific session.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-6 p-4 bg-white shadow-md rounded-xl">
  <div>
    <Label htmlFor="prescriptionType" className="font-semibold text-gray-700">
      Prescription Type
    </Label>
    <Select
      value={prescriptionType}
      onValueChange={setPrescriptionType}
    >
      <SelectTrigger className="mt-1 w-full rounded-lg border border-gray-300 bg-white text-gray-700 focus:ring-2 focus:ring-blue-400 focus:border-blue-400">
        <SelectValue placeholder="Select prescription type" />
      </SelectTrigger>
      <SelectContent className="rounded-lg shadow-lg bg-white">
        {prescriptionTypes.map((type) => (
          <SelectItem key={type} value={type} className="hover:bg-blue-50">
            {type}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  </div>

  <div>
    <Label htmlFor="sessionNumber" className="font-semibold text-gray-700">
      Session Number
    </Label>
    <Select
      value={selectedSessionNumber.toString()}
      onValueChange={(value) =>
        setSelectedSessionNumber(Number.parseInt(value))
      }
    >
      <SelectTrigger className="mt-1 w-full rounded-lg border border-gray-300 bg-white text-gray-700 focus:ring-2 focus:ring-blue-400 focus:border-blue-400">
        <SelectValue placeholder="Select session" />
      </SelectTrigger>
      <SelectContent className="rounded-lg shadow-lg bg-white">
        {Array.from({ length: singleSession?.no_of_session_book || 0 }, (_, i) => (
          <SelectItem key={i + 1} value={(i + 1).toString()} className="hover:bg-blue-50">
            Session {i + 1}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  </div>

  <div>
    <Label htmlFor="prescription-file" className="font-semibold text-gray-700">
      Upload File
    </Label>
    <Input
      id="prescription-file"
      type="file"
      accept="image/*,.pdf"
      onChange={(e) => setPrescriptionFile(e.target.files?.[0] || null)}
      className="mt-1 w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-gray-700 focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
    />
    <p className="text-xs text-gray-500 mt-1">Supported formats: PDF, Image</p>
  </div>
                        </div>

                      <DialogFooter>
                        <Button
                          variant="outline"
                          onClick={() => setPrescriptionDialog(false)}
                        >
                          Cancel
                        </Button>
                        <Button
                          onClick={handleAddPrescription}
                          className="bg-gradient-to-r from-blue-800 to-sky-700 text-white hover:from-blue-900 hover:to-sky-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg px-4 py-2 flex items-center justify-center transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                          disabled={!prescriptionType || loading}
                        >
                          {loading && (
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          )}
                          Add Prescription
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>

                {!singleSession?.session_prescriptions ||
                singleSession?.session_prescriptions.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <FileText className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p>No prescriptions available yet.</p>
                    <p className="text-sm">
                      Add prescriptions using the button above.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {singleSession?.session_prescriptions.map(
                      (prescription, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-3 border rounded-lg"
                        >
                          <div className="flex items-center gap-3">
                            <FileText className="w-5 h-5 text-green-600" />
                            <div>
                              <p className="font-medium">
                                {prescription.prescriptionType}
                              </p>
                              <p className="text-sm text-gray-600">
                                Session {prescription.sessionNumber}
                              </p>
                              {prescription.createdAt && (
                                <p className="text-xs text-gray-500">
                                  Added on{" "}
                                  {format(
                                    new Date(prescription.createdAt),
                                    "PPp"
                                  )}
                                </p>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              size="sm"
                              className="bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 shadow-md hover:shadow-lg focus:ring-2 focus:ring-blue-300 rounded px-2 h-6 flex items-center justify-center transition-all duration-300"
                              onClick={() =>
                                (window.location.href = prescription?.url)
                              }
                            >
                              <Eye className="w-3 h-3" />
                            </Button>

                            <Button
                              size="sm"
                              className="bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700 shadow-md hover:shadow-lg focus:ring-2 focus:ring-green-300 rounded px-2 h-6 flex items-center justify-center transition-all duration-300"
                              onClick={() =>
                                fetch(prescription?.url)
                                  .then((res) => res.blob())
                                  .then((blob) => {
                                    const link = document.createElement("a");
                                    link.href = URL.createObjectURL(blob);
                                    link.download = `Prescription-${prescription?.sessionNumber}.pdf`;
                                    link.click();
                                    URL.revokeObjectURL(link.href); // clean up
                                  })
                                  .catch((err) =>
                                    console.error("Download failed", err)
                                  )
                              }
                            >
                              <Download className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                      )
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default SessionDetails;
