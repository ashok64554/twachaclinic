import { NextResponse } from "next/server";
import { addContactLead } from "@/lib/data";
import { buildLeadEmail, sendMail } from "@/lib/mail";

export async function POST(request: Request) {
  const body = await request.json();
  if (!body.name || !body.phone) {
    return NextResponse.json({ error: "Name and phone are required" }, { status: 400 });
  }

  const lead = await addContactLead({
    name: String(body.name),
    phone: String(body.phone),
    email: body.email ? String(body.email) : "",
    message: [
      body.message ? String(body.message) : ""
    ].filter(Boolean).join("\n")
  });

  const email = buildLeadEmail("Contact", { ...lead, service: "Contact form", doctor: "" });
  const mail = await sendMail({ ...email, replyTo: lead.email || undefined });

  return NextResponse.json({ lead, mail }, { status: 201 });
}
