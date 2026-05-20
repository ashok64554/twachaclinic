"use client";

import { useId, useState } from "react";
import { Send } from "lucide-react";

type FormProps = {
  services: string[];
  doctors?: string[];
  mode?: "appointment" | "contact";
};

export function AppointmentForm({ services, doctors = [], mode = "appointment" }: FormProps) {
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const formId = useId();
  const endpoint = mode === "contact" ? "/api/contact" : "/api/appointments";
  const minDateTime = new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 16);

  async function submit(formData: FormData) {
    setLoading(true);
    setStatus("");
    const payload = Object.fromEntries(formData.entries());
    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    setLoading(false);
    if (response.ok) {
      setStatus(mode === "contact" ? "Thank you. Your message has been sent." : "Thank you. The clinic team will contact you shortly.");
      const form = document.getElementById(formId) as HTMLFormElement | null;
      form?.reset();
      return;
    }
    setStatus("Please check the required fields and try again.");
  }

  return (
    <form id={formId} className="appointment-form" action={submit}>
      <div className="form-row">
        <input name="name" placeholder="Full name*" required />
        <input name="phone" placeholder="Phone number*" required />
      </div>
      <div className="form-row">
        <input name="email" placeholder="Email" type="email" />
        {mode === "appointment" && (
          <select name="service" defaultValue="">
            <option value="">Select service</option>
            {services.map((service) => <option key={service}>{service}</option>)}
          </select>
        )}
      </div>
      {mode === "appointment" && (
        <div className="form-row">
          <select name="doctor" defaultValue="">
            <option value="">Preferred doctor</option>
            {doctors.map((doctor) => <option key={doctor}>{doctor}</option>)}
          </select>
          <input
            aria-label="Preferred date and time"
            min={minDateTime}
            name="preferredDate"
            title="Preferred date and time"
            type="datetime-local"
          />
        </div>
      )}
      <textarea name="message" placeholder="Tell us your concern" rows={4} />
      <button className="primary-btn" disabled={loading} type="submit">
        <Send size={18} />
        {loading ? "Sending..." : mode === "contact" ? "Send Message" : "Book Appointment"}
      </button>
      {status && <p className="form-status">{status}</p>}
    </form>
  );
}
