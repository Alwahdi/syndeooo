"use client";

import { Badge } from "@repo/design-system/components/ui/badge";
import { Button } from "@repo/design-system/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@repo/design-system/components/ui/card";
import {
  BuildingIcon,
  CalendarIcon,
  ClockIcon,
  DollarSignIcon,
  Loader2Icon,
  MapPinIcon,
} from "lucide-react";
import { useTransition } from "react";
import { applyForShift } from "@/app/actions/bookings";

interface Shift {
  _count: { bookings: number };
  city?: string | null;
  clinic?: { name: string | null };
  description?: string | null;
  endTime: string;
  hourlyRate: number;
  id: string;
  locationAddress?: string | null;
  roleRequired: string;
  shiftDate: string;
  startTime: string;
  status: string;
  title: string;
}

interface ShiftsListProps {
  isClinic: boolean;
  shifts: Shift[];
  userId: string;
}

export function ShiftsList({
  shifts,
  isClinic,
  userId: _userId,
}: ShiftsListProps) {
  if (shifts.length === 0) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <div className="text-center">
          <p className="font-medium text-lg text-muted-foreground">
            {isClinic ? "No shifts posted yet" : "No shifts available"}
          </p>
          <p className="text-muted-foreground text-sm">
            {isClinic
              ? "Create a shift to get started"
              : "Check back later for new opportunities"}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {shifts.map((shift) => (
        <ShiftCard isClinic={isClinic} key={shift.id} shift={shift} />
      ))}
    </div>
  );
}

function ShiftCard({ shift, isClinic }: { shift: Shift; isClinic: boolean }) {
  const [isPending, startTransition] = useTransition();
  const shiftDate = new Date(shift.shiftDate);

  function handleApply() {
    startTransition(async () => {
      await applyForShift(shift.id);
    });
  }

  const statusColors: Record<string, string> = {
    open: "bg-green-500/10 text-green-600",
    filled: "bg-blue-500/10 text-blue-600",
    cancelled: "bg-red-500/10 text-red-600",
    completed: "bg-gray-500/10 text-gray-600",
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg">{shift.title}</CardTitle>
          <Badge
            className={statusColors[shift.status] ?? ""}
            variant="secondary"
          >
            {shift.status}
          </Badge>
        </div>
        {shift.clinic && (
          <CardDescription className="flex items-center gap-1">
            <BuildingIcon className="h-3 w-3" />
            {shift.clinic.name}
          </CardDescription>
        )}
      </CardHeader>
      <CardContent className="space-y-2 text-sm">
        <div className="flex items-center gap-2 text-muted-foreground">
          <CalendarIcon className="h-4 w-4" />
          <span>
            {shiftDate.toLocaleDateString("en-US", {
              weekday: "short",
              month: "short",
              day: "numeric",
            })}
          </span>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <ClockIcon className="h-4 w-4" />
          <span>
            {shift.startTime} — {shift.endTime}
          </span>
        </div>
        {shift.city && (
          <div className="flex items-center gap-2 text-muted-foreground">
            <MapPinIcon className="h-4 w-4" />
            <span>{shift.city}</span>
          </div>
        )}
        <div className="flex items-center gap-2 font-medium text-primary">
          <DollarSignIcon className="h-4 w-4" />
          <span>SAR {shift.hourlyRate}/hr</span>
        </div>
        {isClinic && (
          <p className="text-muted-foreground text-xs">
            {shift._count.bookings} application
            {shift._count.bookings !== 1 ? "s" : ""}
          </p>
        )}
      </CardContent>
      {!isClinic && shift.status === "open" && (
        <CardFooter>
          <Button className="w-full" disabled={isPending} onClick={handleApply}>
            {isPending ? (
              <>
                <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                Applying...
              </>
            ) : (
              "Apply for Shift"
            )}
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
