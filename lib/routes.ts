import type { Service } from "@/lib/types";

export type TreatmentRoute = {
  category: string;
  slug: string;
  serviceSlug: string;
  label: string;
};

export const treatmentRoutes: TreatmentRoute[] = [
  { category: "face", slug: "chemical-peels", serviceSlug: "chemical-peels", label: "Chemical Peels" },
  { category: "face", slug: "derma-clean", serviceSlug: "derma-clean", label: "Derma Clean" },
  { category: "face", slug: "melasma", serviceSlug: "melasma-condition", label: "Melasma" },
  { category: "face", slug: "hyper-pigmentation", serviceSlug: "hyperpigmentation-condition", label: "Hyper Pigmentation" },
  { category: "face", slug: "acne-pimple-scars", serviceSlug: "acne-pimple-conditions", label: "Acne / Pimple Scars" },
  { category: "face", slug: "hydrafacial", serviceSlug: "hydrafacial", label: "Hydrafacial" },
  { category: "face", slug: "mnrf", serviceSlug: "microneedling-radiofrequency", label: "MNRF" },
  { category: "face", slug: "hifu", serviceSlug: "hifu", label: "HIFU" },
  { category: "face", slug: "medifacials", serviceSlug: "medifacial", label: "Medifacials" },
  { category: "face", slug: "photofacial", serviceSlug: "intense-pulsed-light", label: "Photofacial" },
  { category: "face", slug: "microblading", serviceSlug: "microblading", label: "Microblading" },
  { category: "face", slug: "double-chin", serviceSlug: "double-chin", label: "Double Chin" },
  { category: "hair", slug: "prp", serviceSlug: "prp", label: "PRP" },
  { category: "hair", slug: "qr678", serviceSlug: "qr-678", label: "QR678" },
  { category: "hair", slug: "gfc", serviceSlug: "gfc", label: "GFC" },
  { category: "hair", slug: "hair-drip", serviceSlug: "hair-drip", label: "Hair Drip" },
  { category: "hair", slug: "regenerative-skin-therapy", serviceSlug: "regenerative-skin-therapy", label: "Regenerative Skin Therapy" },
  { category: "hair", slug: "mesotherapy-for-hair", serviceSlug: "mesotherapy", label: "Mesotherapy for Hair" },
  { category: "laser", slug: "laser-hair-removal", serviceSlug: "laser-hair-reduction", label: "Laser Hair Removal" },
  { category: "laser", slug: "pico-laser", serviceSlug: "pico-laser", label: "Pico Laser" },
  { category: "laser", slug: "q-switched-nd-yag", serviceSlug: "q-switched-nd-yag-laser", label: "Q-Switched Nd:YAG" },
  { category: "injectables", slug: "dermal-fillers", serviceSlug: "dermal-fillers", label: "Dermal Fillers" },
  { category: "injectables", slug: "anti-wrinkle", serviceSlug: "anti-wrinkle-treatment", label: "Anti-Wrinkle" },
  { category: "injectables", slug: "threads", serviceSlug: "thread-lift", label: "Threads" },
  { category: "injectables", slug: "skin-rejuvenation-treatment", serviceSlug: "skin-rejuvenation-treatment", label: "Skin Rejuvenation Treatment" },
  { category: "injectables", slug: "mesotherapy", serviceSlug: "mesotherapy", label: "Mesotherapy" },
  { category: "injectables", slug: "skin-boosters", serviceSlug: "skin-booster-injections", label: "Skin Boosters" },
  { category: "injectables", slug: "wrinkles", serviceSlug: "wrinkle", label: "Wrinkles" },
  { category: "injectables", slug: "face-lift", serviceSlug: "face-lift", label: "Face Lift" },
  { category: "injectables", slug: "bio-remodelling", serviceSlug: "skin-bio-remodelling", label: "Bio-remodelling" },
  { category: "injectables", slug: "lip-beautification", serviceSlug: "lip-beautification", label: "Lip Beautification" },
  { category: "injectables", slug: "face-slimming", serviceSlug: "face-slimming", label: "Face Slimming" },
  { category: "injectables", slug: "brow-lift", serviceSlug: "eyebrow-lift", label: "Brow Lift" },
  { category: "injectables", slug: "ear-lobe-repair", serviceSlug: "ear-lobe-repair", label: "Ear Lobe Repair" },
  { category: "injectables", slug: "double-chin", serviceSlug: "double-chin", label: "Double Chin" },
  { category: "body", slug: "body-polish", serviceSlug: "body-polish", label: "Body Polish" },
  { category: "body", slug: "stretch-marks", serviceSlug: "stretch-marks-treatment", label: "Stretch Marks" },
  { category: "body", slug: "hifu", serviceSlug: "hifu", label: "HIFU" },
  { category: "body", slug: "chemical-peels-for-body", serviceSlug: "chemical-peels", label: "Chemical Peels for Body" },
  { category: "body", slug: "iv-nutrition", serviceSlug: "iv-nutrition", label: "IV Nutrition" }
];

export const treatmentCategoryLinks = [
  { label: "All Treatments", href: "/treatments" },
  { label: "Face Treatments", href: "/treatments#face" },
  { label: "Hair Treatments", href: "/treatments#hair" },
  { label: "Laser Treatments", href: "/treatments#laser" },
  { label: "Injectables", href: "/treatments#injectables" },
  { label: "Body Treatments", href: "/treatments#body" },
  { label: "3D Skin Analyzer", href: "/treatments/3d-skin-analyzer" }
];

export const conditionRoutes = [
  { slug: "acne", serviceSlug: "acne-pimple-conditions", label: "Acne / Pimples" },
  { slug: "melasma", serviceSlug: "melasma-condition", label: "Melasma" },
  { slug: "hyperpigmentation", serviceSlug: "hyperpigmentation-condition", label: "Hyper Pigmentation" },
  { slug: "hairfall", serviceSlug: "hairfall", label: "Hair Fall / Loss" },
  { slug: "excessive-hair-growth", serviceSlug: "excessive-hair-growth", label: "Excessive Hair Growth" },
  { slug: "wrinkles", serviceSlug: "wrinkle", label: "Wrinkles" },
  { slug: "ageing", serviceSlug: "aging", label: "Ageing" },
  { slug: "aesthetic-enhancement", serviceSlug: "aesthetic-and-beauty-enhancement", label: "Aesthetic Enhancement" },
  { slug: "dermatological", serviceSlug: "dermatologic-conditions", label: "Dermatological" }
];

export function findTreatmentRoute(category: string, slug: string) {
  return treatmentRoutes.find((route) => route.category === category && route.slug === slug);
}

export function findConditionRoute(slug: string) {
  return conditionRoutes.find((route) => route.slug === slug);
}

export function canonicalTreatmentHref(service: Service) {
  if (service.slug === "3d-skin-analyzer") return "/treatments/3d-skin-analyzer";
  const route = treatmentRoutes.find((item) => item.serviceSlug === service.slug);
  return route ? `/treatments/${route.category}/${route.slug}` : "/treatments";
}
