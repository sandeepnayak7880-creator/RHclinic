export interface Appointment {
  id: string;
  patient_name: string;
  phone_number: string;
  appointment_date: string;
  appointment_time: string;
  message: string;
  status: "Pending" | "Confirmed" | "Completed" | "Rescheduled";
  created_at: string;
}