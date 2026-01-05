"use client"

import { motion } from "framer-motion"
import { CalendarIcon, Clock, Check } from "lucide-react"
import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Calendar } from "@/components/ui/calendar"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import { format } from "date-fns"

/* ================= DUMMY DATA ================= */

const TIME_SLOTS = [
  "09:00 AM",
  "10:00 AM",
  "11:30 AM",
  "01:00 PM",
  "03:00 PM",
  "05:00 PM",
]

/* ================= COMPONENT ================= */

const ScheduleStep = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>()
  const [selectedTime, setSelectedTime] = useState<string>("")
  const [selectedSessions, setSelectedSessions] = useState<number>(1)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-8"
    >
      {/* HEADER */}
      <div className="text-center space-y-2">
        <h2 className="text-xl font-semibold text-slate-900">
          Schedule Your Appointment
        </h2>
        <p className="text-sm text-slate-600">
          Select date, time & number of sessions
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {/* DATE SELECTION */}
        <Card className="border border-slate-200">
          <CardContent className="p-5 space-y-4">
            <div className="flex items-center gap-2">
              <CalendarIcon className="h-5 w-5 text-blue-600" />
              <Label className="font-semibold">Select Date</Label>
            </div>

            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              disabled={(date) => date < new Date()}
              className="rounded-md border"
            />

            {selectedDate && (
              <p className="text-sm text-center text-slate-600">
                Selected:{" "}
                <span className="font-medium">
                  {format(selectedDate, "dd MMM yyyy")}
                </span>
              </p>
            )}
          </CardContent>
        </Card>

        {/* TIME SLOT */}
        <Card className="border border-slate-200">
          <CardContent className="p-5 space-y-4">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-purple-600" />
              <Label className="font-semibold">Select Time</Label>
            </div>

            {!selectedDate && (
              <p className="text-sm text-slate-500 text-center">
                Please select a date first
              </p>
            )}

            {selectedDate && (
              <div className="grid grid-cols-2 gap-3">
                {TIME_SLOTS.map((slot) => (
                  <button
                    key={slot}
                    onClick={() => setSelectedTime(slot)}
                    className={cn(
                      "p-3 rounded-lg border text-sm font-medium transition-all",
                      selectedTime === slot
                        ? "bg-purple-600 text-white border-purple-600"
                        : "bg-white border-slate-200 hover:border-purple-400"
                    )}
                  >
                    {slot}
                    {selectedTime === slot && (
                      <Check className="h-4 w-4 mx-auto mt-1" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* SESSION SELECTION */}
        <Card className="border border-slate-200">
          <CardContent className="p-5 space-y-4">
            <Label className="font-semibold">Select Sessions</Label>

            <div className="grid grid-cols-3 gap-3">
              {[1, 2, 3, 4, 5, 6].map((num) => (
                <button
                  key={num}
                  onClick={() => setSelectedSessions(num)}
                  className={cn(
                    "p-4 rounded-lg border font-semibold transition-all",
                    selectedSessions === num
                      ? "bg-green-600 text-white border-green-600"
                      : "bg-white border-slate-200 hover:border-green-400"
                  )}
                >
                  {num}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* SUMMARY (OPTIONAL) */}
      <div className="text-center text-sm text-slate-600">
        {selectedDate && selectedTime && (
          <>
            Selected:{" "}
            <span className="font-medium">
              {format(selectedDate, "dd MMM")} • {selectedTime} • {selectedSessions} session(s)
            </span>
          </>
        )}
      </div>
    </motion.div>
  )
}

export default ScheduleStep
