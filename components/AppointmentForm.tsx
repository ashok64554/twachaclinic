"use client";

import { useId, useState } from "react";
import { Send } from "lucide-react";
import { isDoctorAvailableForAppointment } from "@/lib/appointmentAvailability";

type FormProps = {
  services: Array<string | { title: string; category: string }>;
  doctors?: string[];
  mode?: "appointment" | "contact";
};

const appointmentCategories = [
  "Appointment for Dermatologist Consultation",
  "Appointment for Procedure"
];

const categoryLabels: Record<string, string> = {
  "Face Treatments": "Face",
  "Hair Growth Treatments": "Hair",
  "Laser Treatments": "Laser",
  "Cosmetic Injectables": "Injectables",
  "Body Treatments": "Body"
};

function getCurrentLocalDateTime() {
  const now = new Date();
  return new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
}

export function AppointmentForm({ services, doctors = [], mode = "appointment" }: FormProps) {
  const [appointmentType, setAppointmentType] = useState(appointmentCategories[0]);
  const [treatmentCategory, setTreatmentCategory] = useState("");
  const [treatment, setTreatment] = useState("");
  const [minDateTime] = useState(getCurrentLocalDateTime);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const formId = useId();
  const endpoint = mode === "contact" ? "/api/contact" : "/api/appointments";
  const availableDoctors = doctors.filter(isDoctorAvailableForAppointment);
  const procedureServices = services
    .map((service) => typeof service === "string" ? { title: service, category: "Treatments" } : service)
    .filter((service) => service.category !== "Conditions");
  const procedureCategories = Array.from(new Set(procedureServices.map((service) => service.category)));
  const treatmentsForCategory = procedureServices.filter((service) => service.category === treatmentCategory);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setStatus("");
    const form = event.currentTarget;
    const payload = Object.fromEntries(new FormData(form).entries());

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        setStatus(mode === "contact" ? "Thank you. Your message has been sent." : "Thank you. The clinic team will contact you shortly.");
        form.reset();
        setAppointmentType(appointmentCategories[0]);
        setTreatmentCategory("");
        setTreatment("");
        return;
      }

      const data = await response.json().catch(() => null);
      setStatus(data?.error || "Please check the required fields and try again.");
    } catch {
      setStatus("Unable to submit right now. Please call the clinic or try again shortly.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form id={formId} className="appointment-form" onSubmit={submit}>
      <div className="form-row">
        <input name="name" placeholder="Full name*" required />
        <input name="phone" placeholder="Phone number*" required />
      </div>
      <div className="form-row">
        <input name="email" placeholder="Email" type="email" />
        {mode === "appointment" && <input name="city" placeholder="City" />}
        {mode === "appointment" && (
          <input
            aria-label="Selected appointment type"
            name="service"
            readOnly
            type="hidden"
            value={appointmentType}
          />
        )}
      </div>
      {mode === "appointment" && (
        <div className="appointment-type-tabs" role="tablist" aria-label="Appointment type">
          {appointmentCategories.map((category) => (
            <button
              aria-selected={appointmentType === category}
              className={appointmentType === category ? "active" : ""}
              key={category}
              onClick={() => {
                setAppointmentType(category);
                setTreatmentCategory("");
                setTreatment("");
              }}
              role="tab"
              type="button"
            >
              {category}
            </button>
          ))}
        </div>
      )}
      {mode === "appointment" && appointmentType === "Appointment for Procedure" && (
        <div className="form-row">
          <select
            name="treatmentCategory"
            onChange={(event) => {
              setTreatmentCategory(event.target.value);
              setTreatment("");
            }}
            required
            value={treatmentCategory}
          >
            <option value="">Select treatment category</option>
            {procedureCategories.map((category) => (
              <option key={category} value={category}>{categoryLabels[category] || category}</option>
            ))}
          </select>
          <select
            disabled={!treatmentCategory}
            name="treatment"
            onChange={(event) => setTreatment(event.target.value)}
            required
            value={treatment}
          >
            <option value="">Select treatment</option>
            {treatmentsForCategory.map((service) => (
              <option key={`${service.category}-${service.title}`} value={service.title}>{service.title}</option>
            ))}
          </select>
        </div>
      )}
      {mode === "appointment" && (
        <div className="form-row">
          <select name="doctor" defaultValue="">
            <option value="">Preferred doctor</option>
            {availableDoctors.map((doctor) => <option key={doctor}>{doctor}</option>)}
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
