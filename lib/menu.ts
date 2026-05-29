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
  { label: "Our Story", href: "/about" },
  { label: "Our Doctors", href: "/doctors" },
  { label: "Clinic & Technology", href: "/treatments/3d-skin-analyzer" }
];

export const treatmentCategoryMenu: MenuLink[] = [
  { label: "All Treatments", href: "/treatments" },
  { label: "Face Treatments", href: "/treatments#face" },
  { label: "Hair Treatments", href: "/treatments#hair" },
  { label: "Laser Treatments", href: "/treatments#laser" },
  { label: "Injectables", href: "/treatments#injectables" },
  { label: "Body Treatments", href: "/treatments#body" },
  { label: "3D Skin Analyzer", href: "/treatments/3d-skin-analyzer" }
];

export const resourcesMenu: MenuLink[] = [
  { label: "Videos", href: "/videos" },
  { label: "Gallery", href: "/gallery" },
  { label: "Patient FAQs", href: "/resources/faqs" },
  { label: "Pre-care", href: "/resources/pre-care" },
  { label: "Post-care", href: "/resources/post-care" }
];

export const treatmentMenu: MenuGroup[] = [
  {
    title: "Face Treatments",
    links: [
      { label: "Chemical Peels", href: "/treatments/face/chemical-peels" },
      { label: "Derma Clean", href: "/treatments/face/derma-clean" },
      { label: "Melasma", href: "/treatments/face/melasma" },
      { label: "Hyper Pigmentation", href: "/treatments/face/hyper-pigmentation" },
      { label: "Acne / Pimple Scars", href: "/treatments/face/acne-pimple-scars" },
      { label: "Medifacials", href: "/treatments/face/medifacials" },
      { label: "Photofacial", href: "/treatments/face/photofacial" },
      { label: "Hydrafacial", href: "/treatments/face/hydrafacial" },
      { label: "MNRF", href: "/treatments/face/mnrf" },
      { label: "Microblading", href: "/treatments/face/microblading" },
      { label: "Double Chin", href: "/treatments/face/double-chin" },
      { label: "HIFU", href: "/treatments/face/hifu" }
    ]
  },
  {
    title: "Laser Treatments",
    links: [
      { label: "Laser Hair Removal", href: "/treatments/laser/laser-hair-removal" },
      { label: "Pico Laser", href: "/treatments/laser/pico-laser" },
      { label: "Q-Switched Nd:YAG", href: "/treatments/laser/q-switched-nd-yag" }
    ]
  },
  {
    title: "Hair Growth Treatments",
    links: [
      { label: "PRP", href: "/treatments/hair/prp" },
      { label: "QR678", href: "/treatments/hair/qr678" },
      { label: "GFC", href: "/treatments/hair/gfc" },
      { label: "Hair Drip", href: "/treatments/hair/hair-drip" },
      { label: "Regenerative Skin Therapy", href: "/treatments/hair/regenerative-skin-therapy" },
      { label: "Mesotherapy for Hair", href: "/treatments/hair/mesotherapy-for-hair" }
    ]
  },
  {
    title: "Cosmetic Injectables",
    links: [
      { label: "Dermal Fillers", href: "/treatments/injectables/dermal-fillers" },
      { label: "Anti-Wrinkle (Botox)", href: "/treatments/injectables/anti-wrinkle" },
      { label: "Threads", href: "/treatments/injectables/threads" },
      { label: "Skin Rejuvenation Treatment", href: "/treatments/injectables/skin-rejuvenation-treatment" },
      { label: "Brow Lift", href: "/treatments/injectables/brow-lift" },
      { label: "Mesotherapy", href: "/treatments/injectables/mesotherapy" },
      { label: "Skin Boosters", href: "/treatments/injectables/skin-boosters" },
      { label: "Wrinkles", href: "/treatments/injectables/wrinkles" },
      { label: "Face Lift", href: "/treatments/injectables/face-lift" },
      { label: "Lip Beautification", href: "/treatments/injectables/lip-beautification" },
      { label: "Face Slimming", href: "/treatments/injectables/face-slimming" },
      { label: "Ear Lobe Repair", href: "/treatments/injectables/ear-lobe-repair" },
      { label: "Double Chin", href: "/treatments/injectables/double-chin" },
      { label: "Bio-Remodelling", href: "/treatments/injectables/bio-remodelling" }
    ]
  },
  {
    title: "Body Treatments",
    links: [
      { label: "Body Polish", href: "/treatments/body/body-polish" },
      { label: "Chemical Peels", href: "/treatments/body/chemical-peels-for-body" },
      { label: "Stretch Marks", href: "/treatments/body/stretch-marks" },
      { label: "HIFU", href: "/treatments/body/hifu" },
      { label: "IV Nutrition", href: "/treatments/body/iv-nutrition" }
    ]
  }
];

export const conditionMenu: MenuLink[] = [
  { label: "Acne / Pimples", href: "/conditions/acne" },
  { label: "Hair Fall / Loss", href: "/conditions/hairfall" },
  { label: "Pigmentation", href: "/conditions/hyperpigmentation" },
  { label: "Melasma", href: "/conditions/melasma" },
  { label: "Wrinkles", href: "/conditions/wrinkles" },
  { label: "Ageing", href: "/conditions/ageing" },
  { label: "Excessive Hair Growth", href: "/conditions/excessive-hair-growth" }
];
