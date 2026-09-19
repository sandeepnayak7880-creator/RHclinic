"use client";

import { FormEvent, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

const allowedTimeSlots = [
  "10:00",
  "11:00",
  "12:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
  "18:00",
  "19:00",
  "20:00",
] as const;

const maximumPatientsPerSlot = 3;

type BookedSlot = {
  time: string;
  count: number;
};

type BlockedDate = {
  date: string;
};

function normalizeTime(value: unknown) {
  if (typeof value !== "string") {
    return "";
  }

  return value.slice(0, 5);
}

function formatTimeSlot(time: string) {
  const [hourText, minute] = time.split(":");
  const startHour = Number(hourText);
  const endHour = startHour + 1;

  function formatHour(hour: number) {
    const displayHour = hour % 12 || 12;
    const meridiem = hour < 12 ? "AM" : "PM";
    return `${displayHour}:${minute} ${meridiem}`;
  }

  return `${formatHour(startHour)} - ${formatHour(endHour)}`;
}

function normalizeBookedSlots(data: unknown): BookedSlot[] {
  if (!Array.isArray(data)) {
    return [];
  }

  return data.flatMap((row) => {
    if (!row || typeof row !== "object") {
      return [];
    }

    const record = row as Record<string, unknown>;
    const time = normalizeTime(
      record.appointment_time ?? record.slot ?? record.time,
    );
    const countValue = record.booked_count ?? record.count ?? record.total;
    const count = Number(countValue);

    return time && Number.isFinite(count) ? [{ time, count }] : [];
  });
}

type AppointmentFormData = {
  patient_name: string;
  phone_number: string;
  appointment_date: string;
  appointment_time: string;
  message: string;
};

const initialFormData: AppointmentFormData = {
  patient_name: "",
  phone_number: "",
  appointment_date: "",
  appointment_time: "",
  message: "",
};

export function AppointmentForm() {
  const [formData, setFormData] = useState(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [blockedDates, setBlockedDates] = useState<BlockedDate[]>([]);
  const [blockedDateWarning, setBlockedDateWarning] = useState("");
  const [isLoadingSlots, setIsLoadingSlots] = useState(false);
  const [bookedSlots, setBookedSlots] = useState<BookedSlot[]>([]);
  const [slotError, setSlotError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    async function fetchBlockedDates() {
      const supabase = createClient();
      const { data } = await supabase
        .from("blocked_dates")
        .select("date")
        .gte("date", new Date().toISOString().slice(0, 10));

      setBlockedDates((data ?? []) as BlockedDate[]);
    }

    void fetchBlockedDates();
  }, []);

  useEffect(() => {
    const selectedDate = formData.appointment_date;

    if (!selectedDate) {
      setBookedSlots([]);
      setSlotError("");
      setIsLoadingSlots(false);
      return;
    }

    let isCurrentRequest = true;

    async function fetchBookedSlots() {
      setIsLoadingSlots(true);
      setBookedSlots([]);
      setSlotError("");
      setFormData((currentData) => ({ ...currentData, appointment_time: "" }));

      try {
        const supabase = createClient();
        const { data, error } = await supabase.rpc("get_booked_slots", {
          p_date: selectedDate,
        });

        if (error) {
          throw error;
        }

        if (isCurrentRequest) {
          setBookedSlots(normalizeBookedSlots(data));
        }
      } catch {
        if (isCurrentRequest) {
          setSlotError("We could not load availability. Please try again.");
        }
      } finally {
        if (isCurrentRequest) {
          setIsLoadingSlots(false);
        }
      }
    }

    void fetchBookedSlots();

    return () => {
      isCurrentRequest = false;
    };
  }, [formData.appointment_date]);

  function handleChange(
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) {
    const { name, value } = event.target;

    if (name === "appointment_date") {
      if (blockedDates.some((item) => item.date === value)) {
        setFormData((currentData) => ({
          ...currentData,
          appointment_date: "",
          appointment_time: "",
        }));
        setBlockedDateWarning("The clinic is closed on this date. Please select another day.");
        setSuccessMessage("");
        setErrorMessage("");
        return;
      }

      setBlockedDateWarning("");
    }

    setFormData((currentData) => ({ ...currentData, [name]: value }));
    setSuccessMessage("");
    setErrorMessage("");
  }

  function selectTimeSlot(time: string) {
    setFormData((currentData) => ({ ...currentData, appointment_time: time }));
    setSuccessMessage("");
    setErrorMessage("");
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSuccessMessage("");
    setErrorMessage("");

    if (Object.values(formData).some((value) => !value.trim())) {
      setErrorMessage("Please complete all fields before booking your consultation.");
      return;
    }

    setIsSubmitting(true);

    try {
      const supabase = createClient();
      const { error } = await supabase.from("appointments").insert({
        ...formData,
        status: "Pending",
      });

      if (error) {
        throw error;
      }

      const { error: notificationError } = await supabase
        .from("notifications")
        .insert({
          title: "New Appointment",
          message: `${formData.patient_name} booked an appointment for ${formData.appointment_date} at ${formData.appointment_time}.`,
        });

      if (notificationError) {
        console.error("Notification Insert Error:", notificationError.message);
      }

      setFormData(initialFormData);
      setSuccessMessage(
        "Your appointment request has been received. We will contact you shortly to confirm it.",
      );
    } catch {
      setErrorMessage(
        "We could not submit your request right now. Please try again or call the clinic directly.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  const fieldClassName =
    "mt-2 w-full rounded-xl border border-teal-200 bg-white px-4 py-3 text-sm text-teal-950 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10";

  return (
    <form onSubmit={handleSubmit} className="space-y-6" noValidate>
      <div className="grid gap-6 sm:grid-cols-2">
        <label className="text-sm font-semibold text-teal-950">
          Full Name
          <input
            name="patient_name"
            type="text"
            value={formData.patient_name}
            onChange={handleChange}
            className={fieldClassName}
            placeholder="Your full name"
            autoComplete="name"
            required
          />
          {blockedDateWarning ? (
            <p role="alert" className="mt-2 rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-800">
              {blockedDateWarning}
            </p>
          ) : null}
        </label>

        <label className="text-sm font-semibold text-teal-950">
          Phone Number
          <input
            name="phone_number"
            type="tel"
            value={formData.phone_number}
            onChange={handleChange}
            className={fieldClassName}
            placeholder="+91 70200 08721"
            autoComplete="tel"
            required
          />
        </label>

        <label className="text-sm font-semibold text-teal-950">
          Preferred Date
          <input
            name="appointment_date"
            type="date"
            value={formData.appointment_date}
            onChange={handleChange}
            className={fieldClassName}
            required
          />
        </label>

        <fieldset className="sm:col-span-2">
          <legend className="text-sm font-semibold text-teal-950">
            Preferred Time
          </legend>
          {!formData.appointment_date ? (
            <p className="mt-2 rounded-xl bg-teal-50 px-4 py-3 text-sm text-teal-700">
              Select a date to see available time slots.
            </p>
          ) : isLoadingSlots ? (
            <div className="mt-3 flex items-center gap-3 rounded-xl bg-teal-50 px-4 py-3 text-sm text-teal-700">
              <span
                className="h-4 w-4 animate-spin rounded-full border-2 border-emerald-200 border-t-emerald-600"
                aria-hidden="true"
              />
              Checking available times...
            </div>
          ) : slotError ? (
            <p role="alert" className="mt-2 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
              {slotError}
            </p>
          ) : (
            <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-5">
              {allowedTimeSlots.map((time) => {
                const bookedCount = bookedSlots.find((slot) => slot.time === time)?.count ?? 0;
                const isFull = bookedCount >= maximumPatientsPerSlot;
                const isSelected = formData.appointment_time === time;

                return (
                  <button
                    key={time}
                    type="button"
                    disabled={isFull}
                    onClick={() => selectTimeSlot(time)}
                    className={`rounded-xl border px-3 py-3 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600 ${
                      isFull
                        ? "cursor-not-allowed border-slate-200 bg-slate-100 text-slate-400"
                        : isSelected
                          ? "border-emerald-600 bg-emerald-600 text-white shadow-md shadow-emerald-900/10"
                          : "border-teal-200 bg-white text-teal-800 hover:border-emerald-400 hover:bg-emerald-50"
                    }`}
                  >
                    {isFull ? "Full" : formatTimeSlot(time)}
                  </button>
                );
              })}
            </div>
          )}
        </fieldset>
      </div>

      <label className="block text-sm font-semibold text-teal-950">
        Message / Symptoms
        <textarea
          name="message"
          value={formData.message}
          onChange={handleChange}
          className={`${fieldClassName} min-h-32 resize-y`}
          placeholder="Briefly tell us how we can help"
          required
        />
      </label>

      {errorMessage ? (
        <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
          {errorMessage}
        </p>
      ) : null}

      {successMessage ? (
        <p role="status" className="rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          {successMessage}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-full bg-emerald-600 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-emerald-900/10 transition-colors hover:bg-emerald-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting ? "Booking..." : "Book an Appointment"}
      </button>
    </form>
  );
}