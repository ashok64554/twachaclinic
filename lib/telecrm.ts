type TelecrmLeadInput = {
  name: string;
  phone: string;
  email?: string;
  service?: string;
  procedure?: string;
  doctor?: string;
  preferredDate?: string;
  message?: string;
  city?: string;
  source?: string;
};

type TelecrmResult =
  | {
      skipped: true;
      reason: string;
    }
  | {
      skipped: false;
      ok: false;
      status: 0;
      error: string;
    }
  | {
      skipped: false;
      ok: boolean;
      status: number;
      data: unknown;
    };

const fieldNames = {
  name: process.env.TELECRM_FIELD_NAME || "name",
  phone: process.env.TELECRM_FIELD_PHONE || "phone",
  patientId: process.env.TELECRM_FIELD_PATIENT_ID || "patient_id",
  email: process.env.TELECRM_FIELD_EMAIL || "email",
  service: process.env.TELECRM_FIELD_SERVICE || "category",
  procedure: process.env.TELECRM_FIELD_PROCEDURE || "procedure",
  doctor: process.env.TELECRM_FIELD_DOCTOR || "doctor",
  preferredDate: process.env.TELECRM_FIELD_PREFERRED_DATE || "",
  message: process.env.TELECRM_FIELD_MESSAGE || "notes",
  source: process.env.TELECRM_FIELD_SOURCE || "source",
  rating: process.env.TELECRM_FIELD_RATING || "rating",
  status: process.env.TELECRM_FIELD_STATUS || "status",
  stage: process.env.TELECRM_FIELD_STAGE || "stage",
  assignee: process.env.TELECRM_FIELD_ASSIGNEE || "assignee",
  property1: process.env.TELECRM_FIELD_PROPERTY1 || "property1",
  location: process.env.TELECRM_FIELD_LOCATION || process.env.TELECRM_FIELD_CITY || "location",
  dateOfRegistration: process.env.TELECRM_FIELD_DATE_OF_REGISTRATION || "date_of_registration",
  suggestedTreatment: process.env.TELECRM_FIELD_SUGGESTED_TREATMENT || "suggested_treatment"
};

type TelecrmFieldValue = string | number | undefined;

function compactFields(fields: Record<string, TelecrmFieldValue>) {
  return Object.fromEntries(
    Object.entries(fields).filter(([key, value]) => {
      if (!key) return false;
      if (value === undefined) return false;
      if (typeof value === "string") return value.trim().length > 0;
      return true;
    })
  );
}

function normalizeIndianPhone(phone: string) {
  const digits = phone.replace(/\D/g, "");
  if (digits.length === 10) return `91${digits}`;
  if (digits.length === 11 && digits.startsWith("0")) return `91${digits.slice(1)}`;
  if (digits.length === 12 && digits.startsWith("91")) return digits;
  return digits || phone;
}

function formatTelecrmDate(value?: string | Date) {
  const date = value instanceof Date ? value : value ? new Date(value) : new Date();
  if (Number.isNaN(date.getTime())) return "";
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

function formatPreferredDateTime(value?: string) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${day}/${month}/${year} ${hours}:${minutes}`;
}

function toTelecrmTagValue(value?: string) {
  return (value || "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean)
    .join(" , ");
}

function buildNotes(input: TelecrmLeadInput) {
  return [
    input.message?.trim(),
    input.preferredDate ? `Preferred appointment: ${formatPreferredDateTime(input.preferredDate)}` : "",
    input.service ? `Category: ${input.service}` : "",
    input.procedure ? `Procedure: ${input.procedure}` : "",
    input.doctor ? `Doctor: ${input.doctor}` : ""
  ].filter(Boolean).join("\n");
}

export async function sendLeadToTelecrm(input: TelecrmLeadInput): Promise<TelecrmResult> {
  const enterpriseId = process.env.TELECRM_ENTERPRISE_ID;
  const apiKey = process.env.TELECRM_API_KEY;

  if (!enterpriseId) {
    return { skipped: true, reason: "TELECRM_ENTERPRISE_ID is not configured" };
  }

  if (!apiKey) {
    return { skipped: true, reason: "TELECRM_API_KEY is not configured" };
  }

  const normalizedPhone = normalizeIndianPhone(input.phone);
  const status = process.env.TELECRM_DEFAULT_STATUS || "Fresh";
  const stage = process.env.TELECRM_DEFAULT_STAGE || "Not Counselled";
  const fields: Record<string, TelecrmFieldValue> = {
    [fieldNames.phone]: normalizedPhone,
    [fieldNames.name]: input.name,
    [fieldNames.patientId]: normalizedPhone,
    [fieldNames.email]: input.email || "",
    [fieldNames.service]: toTelecrmTagValue(input.service),
    [fieldNames.procedure]: toTelecrmTagValue(input.procedure),
    [fieldNames.doctor]: toTelecrmTagValue(input.doctor),
    [fieldNames.message]: buildNotes(input),
    [fieldNames.source]: toTelecrmTagValue(input.source || "Website"),
    [fieldNames.rating]: Number(process.env.TELECRM_DEFAULT_RATING || 3),
    [fieldNames.status]: status,
    [fieldNames.stage]: toTelecrmTagValue(stage),
    [fieldNames.assignee]: process.env.TELECRM_DEFAULT_ASSIGNEE || "",
    [fieldNames.property1]: normalizedPhone,
    [fieldNames.location]: toTelecrmTagValue(input.city),
    [fieldNames.dateOfRegistration]: formatTelecrmDate(new Date()),
    [fieldNames.suggestedTreatment]: toTelecrmTagValue(input.procedure)
  };

  if (fieldNames.preferredDate) {
    fields[fieldNames.preferredDate] = formatTelecrmDate(input.preferredDate);
  }

  const payload = compactFields(fields);

  try {
    const endpoint =
      process.env.TELECRM_AUTOUPDATE_URL ||
      `https://next-api.telecrm.in/enterprise/${enterpriseId}/autoupdatelead`;

    const response = await fetch(
      endpoint,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ fields: payload })
      }
    );

    const rawResponse = await response.text();
    let data: unknown = rawResponse;
    try {
      data = rawResponse ? JSON.parse(rawResponse) : null;
    } catch {
      data = rawResponse;
    }

    return {
      skipped: false,
      ok: response.ok,
      status: response.status,
      data
    };
  } catch (error) {
    return {
      skipped: false,
      ok: false,
      status: 0,
      error: error instanceof Error ? error.message : "TeleCRM request failed"
    };
  }
}
