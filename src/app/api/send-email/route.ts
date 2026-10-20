import { Resend } from "resend";
import { NextResponse } from "next/server";

type BookingEmailBody = {
  name?: unknown;
  phone?: unknown;
  consultationType?: unknown;
  preferredDate?: unknown;
  preferredTime?: unknown;
  notes?: unknown;
};

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

export async function POST(request: Request) {
  const apiKey = process.env.RESEND_API_KEY;
  const doctorEmail = process.env.DOCTOR_EMAIL;

  if (!apiKey || !doctorEmail) {
    console.error("Booking email configuration is missing RESEND_API_KEY or DOCTOR_EMAIL.");
    return NextResponse.json({ error: "Email service is not configured." }, { status: 500 });
  }

  let body: BookingEmailBody;
  try {
    body = (await request.json()) as BookingEmailBody;
  } catch {
    return NextResponse.json({ error: "Request body must be valid JSON." }, { status: 400 });
  }

  const requiredFields = [
    body.name,
    body.phone,
    body.consultationType,
    body.preferredDate,
    body.preferredTime,
  ];
  if (requiredFields.some((value) => typeof value !== "string" || !value.trim())) {
    return NextResponse.json({ error: "Name, phone, consultation type, date, and time are required." }, { status: 400 });
  }

  const name = escapeHtml(body.name as string);
  const phone = escapeHtml(body.phone as string);
  const consultationType = escapeHtml(body.consultationType as string);
  const preferredDate = escapeHtml(body.preferredDate as string);
  const preferredTime = escapeHtml(body.preferredTime as string);
  const notes = escapeHtml(typeof body.notes === "string" ? body.notes : "Not provided");
  const safePhoneLink = (body.phone as string).replace(/[^+\d]/g, "");
  const consultationBadgeColor = consultationType.toLowerCase().includes("online") ? "#2563eb" : "#059669";

  try {
    const resend = new Resend(apiKey);
    const { data, error } = await resend.emails.send({
      from: "Raghavendra Clinic <appointments@raghavendrahomeopathy.in>",
      to: doctorEmail,
      subject: `New appointment request: ${body.name as string}`,
      html: `
        <!doctype html>
        <html lang="en">
          <head><meta name="viewport" content="width=device-width, initial-scale=1.0"><meta charset="utf-8"></head>
          <body style="margin:0;background:#f0fdfa;font-family:Arial,Helvetica,sans-serif;color:#134e4a;">
            <div style="max-width:640px;margin:24px auto;background:#ffffff;border:1px solid #ccfbf1;border-radius:16px;overflow:hidden;">
              <div style="padding:28px 32px;background:#064e3b;color:#ffffff;">
                <p style="margin:0 0 8px;color:#a7f3d0;font-size:12px;font-weight:bold;letter-spacing:2px;text-transform:uppercase;">New booking request</p>
                <h1 style="margin:0;font-size:24px;line-height:1.3;">Raghavendra Homoeopathic Clinic</h1>
              </div>
              <div style="padding:28px 32px;">
                <p style="margin:0 0 20px;color:#475569;">A patient has requested an appointment. Details are below.</p>
                <div style="margin-bottom:20px;"><span style="display:inline-block;padding:7px 12px;border-radius:999px;background:${consultationBadgeColor};color:#ffffff;font-size:13px;font-weight:bold;">${consultationType}</span></div>
                <table role="presentation" style="width:100%;border-collapse:collapse;font-size:14px;">
                  <tr><td style="padding:12px;border-bottom:1px solid #e2e8f0;color:#64748b;width:36%;">Patient</td><td style="padding:12px;border-bottom:1px solid #e2e8f0;font-weight:bold;">${name}</td></tr>
                  <tr><td style="padding:12px;border-bottom:1px solid #e2e8f0;color:#64748b;">Phone</td><td style="padding:12px;border-bottom:1px solid #e2e8f0;"><a href="tel:${escapeHtml(safePhoneLink)}" style="color:#047857;font-weight:bold;">${phone}</a></td></tr>
                  <tr><td style="padding:12px;border-bottom:1px solid #e2e8f0;color:#64748b;">Preferred date</td><td style="padding:12px;border-bottom:1px solid #e2e8f0;">${preferredDate}</td></tr>
                  <tr><td style="padding:12px;border-bottom:1px solid #e2e8f0;color:#64748b;">Preferred time</td><td style="padding:12px;border-bottom:1px solid #e2e8f0;">${preferredTime}</td></tr>
                  <tr><td style="padding:12px;color:#64748b;vertical-align:top;">Notes</td><td style="padding:12px;white-space:pre-wrap;">${notes}</td></tr>
                </table>
              </div>
              <div style="padding:16px 32px;background:#f8fafc;color:#64748b;font-size:12px;">Clinic appointment notification</div>
            </div>
          </body>
        </html>
      `,
    });

    if (error) {
      console.error("Resend booking email failed:", error);
      return NextResponse.json({ error: "Unable to send booking notification." }, { status: 500 });
    }

    return NextResponse.json({ success: true, id: data?.id }, { status: 200 });
  } catch (error) {
    console.error("Resend booking email failed:", error);
    return NextResponse.json({ error: "Unable to send booking notification." }, { status: 500 });
  }
}