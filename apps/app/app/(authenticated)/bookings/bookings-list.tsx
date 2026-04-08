"use client";

import { Badge } from "@repo/design-system/components/ui/badge";
import { Button } from "@repo/design-system/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@repo/design-system/components/ui/card";
import {
  CalendarIcon,
  CheckIcon,
  Loader2Icon,
  UserIcon,
  XIcon,
} from "lucide-react";
import { useTransition } from "react";
import { updateBookingStatus } from "@/app/actions/bookings";

interface Booking {
  createdAt: string;
  id: string;
  professional?: {
    fullName: string | null;
    email: string | null;
    avatarUrl: string | null;
  };
  shift: {
    title: string;
    shiftDate: string;
    startTime: string;
    endTime: string;
    hourlyRate: number;
    city: string | null;
    clinic?: { name: string; city: string | null };
  };
  status: string;
}

interface BookingsListProps {
  bookings: Booking[];
  isClinic: boolean;
}

export function BookingsList({ bookings, isClinic }: BookingsListProps) {
  if (bookings.length === 0) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <div className="text-center">
          <p className="font-medium text-lg text-muted-foreground">
            No bookings yet
          </p>
          <p className="text-muted-foreground text-sm">
            {isClinic
              ? "Bookings will appear when professionals apply to your shifts"
              : "Apply for shifts to see your bookings here"}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {bookings.map((booking) => (
        <BookingCard booking={booking} isClinic={isClinic} key={booking.id} />
      ))}
    </div>
  );
}

function BookingCard({
  booking,
  isClinic,
}: {
  booking: Booking;
  isClinic: boolean;
}) {
  const [isPending, startTransition] = useTransition();
  const shiftDate = new Date(booking.shift.shiftDate);

  const statusColors: Record<string, string> = {
    requested: "bg-yellow-500/10 text-yellow-600",
    accepted: "bg-green-500/10 text-green-600",
    declined: "bg-red-500/10 text-red-600",
    confirmed: "bg-blue-500/10 text-blue-600",
    completed: "bg-gray-500/10 text-gray-600",
    cancelled: "bg-red-500/10 text-red-600",
  };

  function handleAction(
    status: "accepted" | "declined" | "confirmed" | "cancelled"
  ) {
    startTransition(async () => {
      await updateBookingStatus(booking.id, status);
    });
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg">{booking.shift.title}</CardTitle>
            {booking.shift.clinic && (
              <p className="text-muted-foreground text-sm">
                {booking.shift.clinic.name}
              </p>
            )}
            {isClinic && booking.professional && (
              <p className="mt-1 flex items-center gap-1 text-muted-foreground text-sm">
                <UserIcon className="h-3 w-3" />
                {booking.professional.fullName ??
                  booking.professional.email ??
                  "Unknown"}
              </p>
            )}
          </div>
          <Badge
            className={statusColors[booking.status] ?? ""}
            variant="secondary"
          >
            {booking.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-1 text-muted-foreground text-sm">
        <div className="flex items-center gap-2">
          <CalendarIcon className="h-4 w-4" />
          <span>
            {shiftDate.toLocaleDateString("en-US", {
              weekday: "short",
              month: "short",
              day: "numeric",
            })}{" "}
            {booking.shift.startTime} - {booking.shift.endTime}
          </span>
        </div>
        <p className="font-medium text-primary">
          SAR {booking.shift.hourlyRate}/hr
        </p>
      </CardContent>
      <CardFooter className="gap-2">
        {isClinic && booking.status === "requested" && (
          <>
            <Button
              disabled={isPending}
              onClick={() => handleAction("accepted")}
              size="sm"
            >
              {isPending ? (
                <Loader2Icon className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  <CheckIcon className="mr-1 h-4 w-4" />
                  Accept
                </>
              )}
            </Button>
            <Button
              disabled={isPending}
              onClick={() => handleAction("declined")}
              size="sm"
              variant="outline"
            >
              <XIcon className="mr-1 h-4 w-4" />
              Decline
            </Button>
          </>
        )}
        {!isClinic && booking.status === "accepted" && (
          <Button
            disabled={isPending}
            onClick={() => handleAction("confirmed")}
            size="sm"
          >
            {isPending ? (
              <Loader2Icon className="h-4 w-4 animate-spin" />
            ) : (
              <>
                <CheckIcon className="mr-1 h-4 w-4" />
                Confirm
              </>
            )}
          </Button>
        )}
        {!isClinic && ["requested", "accepted"].includes(booking.status) && (
          <Button
            disabled={isPending}
            onClick={() => handleAction("cancelled")}
            size="sm"
            variant="outline"
          >
            <XIcon className="mr-1 h-4 w-4" />
            Cancel
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
