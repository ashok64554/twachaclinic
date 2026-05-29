import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import type { Doctor } from "@/lib/types";

export function DoctorCard({ doctor }: { doctor: Doctor }) {
  return (
    <article className="doctor-card">
      <Image
        src={doctor.image}
        alt={doctor.name}
        width={520}
        height={620}
        sizes="(max-width: 760px) 100vw, (max-width: 1180px) 50vw, 25vw"
      />
      <div>
        <h3>{doctor.name}</h3>
        <p className="role">{doctor.title}</p>
        <p>{doctor.summary}</p>
        <Link href={`/doctors/${doctor.slug}`}>Read profile <ArrowRight size={16} /></Link>
      </div>
    </article>
  );
}
