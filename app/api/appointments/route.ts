import { NextResponse } from "next/server";
import { isDoctorAvailableForAppointment } from "@/lib/appointmentAvailability";
import { addAppointment } from "@/lib/data";
import { buildLeadEmail, sendMail } from "@/lib/mail";
import { sendLeadToTelecrm } from "@/lib/telecrm";

export async function POST(request: Request) {
  const body = await request.json();
  if (!body.name || !body.phone) {
    return NextResponse.json({ error: "Name and phone are required" }, { status: 400 });
  }
  const doctor = body.doctor ? String(body.doctor) : "";
  if (doctor && !isDoctorAvailableForAppointment(doctor)) {
    return NextResponse.json({ error: "Selected doctor is not available for appointments" }, { status: 400 });
  }
  const appointmentType = body.service ? String(body.service) : "Appointment for Dermatologist Consultation";
  const treatmentCategory = body.treatmentCategory ? String(body.treatmentCategory) : "";
  const treatment = body.treatment ? String(body.treatment) : "";
  const service = appointmentType === "Appointment for Procedure" && treatment
    ? `${appointmentType}: ${treatment}`
    : appointmentType;

  const appointment = await addAppointment({
    name: String(body.name),
    phone: String(body.phone),
    email: body.email ? String(body.email) : "",
    service,
    doctor,
    message: [
      treatmentCategory ? `Treatment category: ${treatmentCategory}` : "",
      treatment ? `Treatment: ${treatment}` : "",
      body.preferredDate ? `Preferred date/time: ${String(body.preferredDate)}` : "",
      body.message ? String(body.message) : ""
    ].filter(Boolean).join("\n")
  });

  const email = buildLeadEmail("Appointment", {
    ...appointment,
    preferredDate: body.preferredDate ? String(body.preferredDate) : ""
  });
  const mail = await sendMail({ ...email, replyTo: appointment.email || undefined }).catch((error) => ({
    sent: false,
    error: error instanceof Error ? error.message : "Mail request failed"
  }));
  const telecrm = await sendLeadToTelecrm({
    name: appointment.name,
    phone: appointment.phone,
    email: appointment.email,
    service: appointmentType,
    procedure: treatment,
    doctor: appointment.doctor,
    preferredDate: body.preferredDate ? String(body.preferredDate) : "",
    message: appointment.message,
    city: body.city ? String(body.city) : "",
    source: "Website"
  });

  if (!telecrm.skipped && !telecrm.ok) {
    console.error("TeleCRM appointment sync failed", telecrm);
  }

  return NextResponse.json({ appointment, mail, telecrm }, { status: 201 });
}
