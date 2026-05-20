export type MenuLink = {
  label: string;
  href: string;
};

export type MenuGroup = {
  title: string;
  links: MenuLink[];
};

const service = (slug: string) => `/services/${slug}`;

export const aboutMenu: MenuLink[] = [
  { label: "About Twacha Skin Clinic", href: "/about" },
  { label: "Our Specialists", href: "/doctors" },
  { label: "Our Team", href: "/doctors" },
  { label: "Book an Appointment", href: "/book-appointment" },
  { label: "Terms & Conditions", href: "/terms-and-conditions" }
];

export const treatmentMenu: MenuGroup[] = [
  {
    title: "Face Treatments",
    links: [
      { label: "Chemical Peels", href: service("chemical-peels") },
      { label: "Derma Clean", href: service("derma-clean") },
      { label: "Melasma", href: service("melasma-condition") },
      { label: "Hyper Pigmentation", href: service("hyperpigmentation-condition") },
      { label: "Acne / Pimple Scars", href: service("acne-pimple-conditions") },
      { label: "Medifacials", href: service("medifacial") },
      { label: "IPL Photofacial", href: service("intense-pulsed-light") },
      { label: "Hydrafacial", href: service("hydrafacial") },
      { label: "MNRF", href: service("microneedling-radiofrequency") },
      { label: "Microblading", href: service("microblading") },
      { label: "Double Chin", href: service("double-chin") },
      { label: "HIFU", href: service("hifu") }
    ]
  },
  {
    title: "Laser Treatments",
    links: [
      { label: "Laser Hair Removal", href: service("laser-hair-reduction") },
      { label: "Picosecond Laser", href: service("pico-laser") },
      { label: "Q-Switched Nd Yag Laser", href: service("q-switched-nd-yag-laser") }
    ]
  },
  {
    title: "Hair Growth Treatments",
    links: [
      { label: "PRP", href: service("prp") },
      { label: "QR678", href: service("qr-678") },
      { label: "Regenerative Skin Therapy", href: service("regenerative-skin-therapy") },
      { label: "GFC", href: service("gfc") },
      { label: "Hair Drip", href: service("hair-drip") }
    ]
  },
  {
    title: "Cosmetic Injectables",
    links: [
      { label: "Dermal Fillers", href: service("dermal-fillers") },
      { label: "Anti-Wrinkle Treatment", href: service("anti-wrinkle-treatment") },
      { label: "Threads", href: service("thread-lift") },
      { label: "Skin Rejuvenation Treatment", href: service("skin-rejuvenation-treatment") },
      { label: "Brow Lift", href: service("eyebrow-lift") },
      { label: "Mesotherapy", href: service("mesotherapy") },
      { label: "Skin Boosters", href: service("skin-booster-injections") },
      { label: "Wrinkles", href: service("wrinkle") },
      { label: "Face Lift", href: service("face-lift") },
      { label: "Lip Beautification", href: service("lip-beautification") },
      { label: "Ear Lobe Repair", href: service("ear-lobe-repair") },
      { label: "Face Slimming", href: service("face-slimming") },
      { label: "Double Chin", href: service("double-chin") },
      { label: "Skin Bio-remodelling", href: service("skin-bio-remodelling") }
    ]
  },
  {
    title: "Body Treatments",
    links: [
      { label: "Body Polish", href: service("body-polish") },
      { label: "Chemical Peels", href: service("chemical-peels") },
      { label: "Stretch Marks", href: service("stretch-marks-treatment") },
      { label: "HIFU", href: service("hifu") }
    ]
  },
  {
    title: "IV Nutrition",
    links: [
      { label: "IV Nutrition", href: service("iv-nutrition") }
    ]
  }
];

export const conditionMenu: MenuLink[] = [
  { label: "Acne / Pimples", href: service("acne-pimple-conditions") },
  { label: "Hyper Pigmentation", href: service("hyperpigmentation-condition") },
  { label: "Melasma", href: service("melasma-condition") },
  { label: "Wrinkles", href: service("wrinkle") },
  { label: "Ageing", href: service("aging") },
  { label: "Aesthetic / Beauty Enhancement", href: service("aesthetic-and-beauty-enhancement") },
  { label: "Dermatological", href: service("dermatologic-conditions") },
  { label: "Hair Fall / Loss", href: service("hairfall") },
  { label: "Excessive Hair Growth", href: service("excessive-hair-growth") }
];
