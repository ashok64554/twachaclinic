import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { canonicalTreatmentHref } from "@/lib/routes";
import type { Service } from "@/lib/types";

export function ServiceCard({ service }: { service: Service }) {
  const href = canonicalTreatmentHref(service);

  return (
    <article className="service-card">
      <Image
        src={service.image}
        alt={service.title}
        width={640}
        height={420}
        sizes="(max-width: 760px) 100vw, (max-width: 1180px) 50vw, 33vw"
      />
      <div>
        <span>{service.category}</span>
        <h3>{service.title}</h3>
        <p>{service.excerpt}</p>
        <Link href={href}>View treatment <ArrowRight size={16} /></Link>
      </div>
    </article>
  );
}
