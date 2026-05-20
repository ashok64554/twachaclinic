import { NextResponse } from "next/server";
import { addAppointment } from "@/lib/data";
import { buildLeadEmail, sendMail } from "@/lib/mail";

export async function POST(request: Request) {
  const body = await request.json();
  if (!body.name || !body.phone) {
    return NextResponse.json({ error: "Name and phone are required" }, { status: 400 });
  }

  const appointment = await addAppointment({
    name: String(body.name),
    phone: String(body.phone),
    email: body.email ? String(body.email) : "",
    service: body.service ? String(body.service) : "",
    doctor: body.doctor ? String(body.doctor) : "",
    message: [
      body.preferredDate ? `Preferred date/time: ${String(body.preferredDate)}` : "",
      body.message ? String(body.message) : ""
    ].filter(Boolean).join("\n")
  });

  const email = buildLeadEmail("Appointment", {
    ...appointment,
    preferredDate: body.preferredDate ? String(body.preferredDate) : ""
  });
  const mail = await sendMail({ ...email, replyTo: appointment.email || undefined });

  return NextResponse.json({ appointment, mail }, { status: 201 });
}
