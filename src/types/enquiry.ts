export interface Enquiry {
  id: string;
  name: string;
  phone_number: string;
  subject: string;
  message: string;
  status: "unread" | "read" | "archived";
  created_at: string;
}