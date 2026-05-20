import net from "net";
import tls from "tls";

type MailPayload = {
  subject: string;
  html: string;
  text: string;
  replyTo?: string;
};

type LeadPayload = {
  name: string;
  phone: string;
  email: string;
  service: string;
  doctor: string;
  message: string;
  preferredDate?: string;
};

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function formatPreferredDateTime(value?: string) {
  if (!value) {
    return { date: "Not provided", time: "Not provided" };
  }

  const [datePart, timePart = ""] = value.split("T");
  const [year, month, day] = datePart.split("-");
  return {
    date: year && month && day ? `${day}/${month}/${year}` : value,
    time: timePart ? timePart.slice(0, 5) : "Not provided"
  };
}

export function buildLeadEmail(type: "Appointment" | "Contact", lead: LeadPayload) {
  const appointmentDateTime = formatPreferredDateTime(lead.preferredDate);
  const rows = type === "Appointment"
    ? [
        ["Service", lead.service || "Not selected"],
        ["Doctor", lead.doctor || "Not selected"],
        ["Patient Name", lead.name],
        ["Phone", lead.phone],
        ["Email", lead.email || "Not provided"],
        ["Appointment Date", appointmentDateTime.date],
        ["Appointment Time", appointmentDateTime.time],
        ["Message", lead.message || "Not provided"]
      ]
    : [
        ["Patient Name", lead.name],
        ["Phone", lead.phone],
        ["Email", lead.email || "Not provided"],
        ["Message", lead.message || "Not provided"]
      ];

  const title = type === "Appointment" ? "New Appointment Scheduled" : "New Contact Enquiry";
  const intro = type === "Appointment"
    ? "A new doctor appointment has been scheduled. Here are the details:"
    : "A new website contact enquiry has been submitted. Here are the details:";
  const footerNote = type === "Appointment"
    ? "Please review the details and contact the patient to confirm the appointment."
    : "Please review the details and contact the patient.";
  const subject = type === "Appointment" ? `New Appointment Scheduled - ${lead.name}` : `Twacha Contact Enquiry - ${lead.name}`;
  const htmlRows = rows.map(([label, value], index) => `
    <tr style="background:${index % 2 === 0 ? "#eee7f6" : "#ffffff"};">
      <td style="padding:14px 16px;font-weight:700;color:#111827;width:36%;">${label}</td>
      <td style="padding:14px 16px;color:#111827;">${escapeHtml(value)}</td>
    </tr>
  `).join("");

  return {
    subject,
    text: rows.map(([label, value]) => `${label}: ${value}`).join("\n"),
    html: `
      <div style="margin:0;padding:0;background:#f3eff8;font-family:Arial,Helvetica,sans-serif;color:#111827;line-height:1.5;">
        <div style="max-width:810px;margin:0 auto;padding:0 0 28px;">
          <div style="height:33px;background:#7b1fa2;"></div>
          <div style="background:#ffffff;padding:28px;">
            <h2 style="margin:0 0 22px;color:#6a0dad;font-size:20px;line-height:1.25;font-weight:700;">${title}</h2>
            <p style="margin:0 0 18px;font-size:16px;color:#111827;">${intro}</p>
            <table role="presentation" cellpadding="0" cellspacing="0" style="border-collapse:collapse;width:100%;font-size:16px;margin:0 0 24px;">
              ${htmlRows}
            </table>
            <p style="margin:0;font-size:16px;color:#111827;">${footerNote}</p>
          </div>
          <p style="margin:18px 0 0;text-align:center;color:#776b84;font-size:13px;">
            &copy; Twacha Clinic | <a href="https://twachaclinic.com" style="color:#2563eb;text-decoration:none;">https://twachaclinic.com</a>
          </p>
        </div>
      </div>
    `
  };
}

function readLine(socket: net.Socket | tls.TLSSocket) {
  return new Promise<string>((resolve, reject) => {
    let buffer = "";
    const onData = (chunk: Buffer) => {
      buffer += chunk.toString("utf8");
      if (/\r?\n/.test(buffer) && /^\d{3}[ -]/m.test(buffer)) {
        socket.off("data", onData);
        resolve(buffer);
      }
    };
    socket.on("data", onData);
    socket.once("error", reject);
  });
}

async function command(socket: net.Socket | tls.TLSSocket, line: string) {
  socket.write(`${line}\r\n`);
  return readLine(socket);
}

function encodeAddress(name: string, email: string) {
  return `"${name.replaceAll('"', "")}" <${email}>`;
}

export async function sendMail(payload: MailPayload) {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT || 587);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const to = process.env.MAIL_TO || process.env.SMTP_TO;
  const from = process.env.SMTP_FROM || user;
  const secure = process.env.SMTP_SECURE === "true" || port === 465;

  if (!host || !user || !pass || !to || !from) {
    return { sent: false, reason: "SMTP is not configured" };
  }

  const socket = secure
    ? tls.connect({ host, port, servername: host })
    : net.connect({ host, port });

  await new Promise<void>((resolve, reject) => {
    socket.once("connect", resolve);
    socket.once("secureConnect", resolve);
    socket.once("error", reject);
  });

  await readLine(socket);
  await command(socket, `EHLO ${host}`);

  let activeSocket: net.Socket | tls.TLSSocket = socket;
  if (!secure && port === 587) {
    await command(activeSocket, "STARTTLS");
    activeSocket = tls.connect({ socket, servername: host });
    await new Promise<void>((resolve, reject) => {
      activeSocket.once("secureConnect", resolve);
      activeSocket.once("error", reject);
    });
    await command(activeSocket, `EHLO ${host}`);
  }

  await command(activeSocket, "AUTH LOGIN");
  await command(activeSocket, Buffer.from(user).toString("base64"));
  await command(activeSocket, Buffer.from(pass).toString("base64"));
  await command(activeSocket, `MAIL FROM:<${from}>`);
  await command(activeSocket, `RCPT TO:<${to}>`);
  await command(activeSocket, "DATA");

  const headers = [
    `From: ${encodeAddress("Twacha Website", from)}`,
    `To: ${to}`,
    `Subject: ${payload.subject}`,
    payload.replyTo ? `Reply-To: ${payload.replyTo}` : "",
    "MIME-Version: 1.0",
    "Content-Type: text/html; charset=UTF-8"
  ].filter(Boolean).join("\r\n");

  activeSocket.write(`${headers}\r\n\r\n${payload.html}\r\n.\r\n`);
  await readLine(activeSocket);
  await command(activeSocket, "QUIT");
  activeSocket.end();
  return { sent: true };
}
