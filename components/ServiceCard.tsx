import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Service } from "@/lib/types";

export function ServiceCard({ service }: { service: Service }) {
  return (
    <article className="service-card">
      <img src={service.image} alt={service.title} />
      <div>
        <span>{service.category}</span>
        <h3>{service.title}</h3>
        <p>{service.excerpt}</p>
        <Link href={`/services/${service.slug}`}>View treatment <ArrowRight size={16} /></Link>
      </div>
    </article>
  );
}
