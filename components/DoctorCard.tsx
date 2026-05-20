import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Doctor } from "@/lib/types";

export function DoctorCard({ doctor }: { doctor: Doctor }) {
  return (
    <article className="doctor-card">
      <img src={doctor.image} alt={doctor.name} />
      <div>
        <h3>{doctor.name}</h3>
        <p className="role">{doctor.title}</p>
        <p>{doctor.summary}</p>
        <Link href={`/doctors/${doctor.slug}`}>Read profile <ArrowRight size={16} /></Link>
      </div>
    </article>
  );
}
