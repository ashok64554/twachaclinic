const unavailableAppointmentDoctors = new Set(["dr. richa sharma"]);

export function isDoctorAvailableForAppointment(name: string) {
  return !unavailableAppointmentDoctors.has(name.trim().toLowerCase());
}
